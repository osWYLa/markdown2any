import express from 'express';
import cors from 'cors';
import { marked } from 'marked';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure marked to only support specified markdown features
marked.setOptions({
  breaks: true,
  gfm: false, // Disable GitHub Flavored Markdown extensions
});

// Helper function to generate HTML with styles
function generateHTML(markdownContent, config) {
  const {
    canvas_width = 1080,
    canvas_height = 1920,
    background_color = '#FFFFFF',
    text_color = '#333333',
    accent_color = '#007AFF',
    font_family = 'PingFang SC, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    font_size = 16,
    padding = 40,
    line_height = 1.6,
    paragraph_spacing = 20,
    author = '',
    timestamp = '',
    meta_position = 'bottom'
  } = config;

  // Parse markdown to HTML
  const contentHTML = marked.parse(markdownContent);

  // Generate meta information HTML
  let metaHTML = '';
  if (author || timestamp) {
    const metaContent = [];
    if (author) metaContent.push(`<span class="author">${author}</span>`);
    if (timestamp) metaContent.push(`<span class="timestamp">${timestamp}</span>`);
    
    metaHTML = `
      <div class="meta-info meta-${meta_position}">
        ${metaContent.join(' · ')}
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Markdown to Image</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          width: ${canvas_width}px;
          min-height: ${canvas_height}px;
          background-color: ${background_color};
          color: ${text_color};
          font-family: ${font_family};
          font-size: ${font_size}px;
          line-height: ${line_height};
          padding: ${padding}px;
          display: flex;
          flex-direction: column;
        }
        
        .content {
          flex: 1;
        }
        
        h1, h2, h3, h4 {
          color: ${accent_color};
          margin-bottom: ${paragraph_spacing}px;
          font-weight: 600;
          line-height: 1.3;
        }
        
        h1 {
          font-size: ${font_size * 2}px;
        }
        
        h2 {
          font-size: ${font_size * 1.75}px;
        }
        
        h3 {
          font-size: ${font_size * 1.5}px;
        }
        
        h4 {
          font-size: ${font_size * 1.25}px;
        }
        
        p {
          margin-bottom: ${paragraph_spacing}px;
        }
        
        ul, ol {
          margin-bottom: ${paragraph_spacing}px;
          padding-left: ${font_size * 1.5}px;
        }
        
        li {
          margin-bottom: ${paragraph_spacing / 2}px;
        }
        
        strong {
          font-weight: 600;
          color: ${accent_color};
        }
        
        em {
          font-style: italic;
        }
        
        a {
          color: ${accent_color};
          text-decoration: none;
          border-bottom: 1px solid ${accent_color};
        }
        
        .meta-info {
          font-size: ${font_size * 0.875}px;
          color: ${text_color}80;
          text-align: center;
        }
        
        .meta-top {
          margin-bottom: ${padding}px;
        }
        
        .meta-bottom {
          margin-top: ${padding}px;
        }
        
        .author::after {
          content: '';
        }
      </style>
    </head>
    <body>
      ${meta_position === 'top' ? metaHTML : ''}
      <div class="content">
        ${contentHTML}
      </div>
      ${meta_position === 'bottom' ? metaHTML : ''}
    </body>
    </html>
  `;
}

// API endpoint to generate image
app.post('/api/generate', async (req, res) => {
  let browser;
  
  try {
    const { markdown_content, config } = req.body;

    if (!markdown_content) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }

    // Generate HTML
    const html = generateHTML(markdown_content, config || {});

    // Launch puppeteer
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    browser = await puppeteer.launch({
      args: isProd ? [...chromium.args, '--hide-scrollbars', '--disable-web-security'] : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: isProd ? await chromium.executablePath() : (process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
      headless: isProd ? chromium.headless : true,
    });

    const page = await browser.newPage();

    // Set viewport to match canvas size
    const width = config?.canvas_width || 1080;
    const height = config?.canvas_height || 1920;
    
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2, // High DPI for better quality
    });

    // Set content
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
    });

    await browser.close();

    // Send image as base64
    res.json({
      success: true,
      image: `data:image/png;base64,${screenshot.toString('base64')}`
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({
      error: 'Failed to generate image',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
