import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import html2canvas from 'html2canvas';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

// 预设主题
const getThemes = (t) => ({
  light: {
    id: 'light',
    name: t('themes.light'),
    config: {
      background_color: '#FFFFFF',
      text_color: '#333333',
      accent_color: '#007AFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  dark: {
    id: 'dark',
    name: t('themes.dark'),
    config: {
      background_color: '#1a1a1a',
      text_color: '#E5E5E5',
      accent_color: '#4A9EFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  warm: {
    id: 'warm',
    name: t('themes.warm'),
    config: {
      background_color: '#FFF8F0',
      text_color: '#5D4E37',
      accent_color: '#D2691E',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  forest: {
    id: 'forest',
    name: t('themes.forest'),
    config: {
      background_color: '#F0F9F0',
      text_color: '#2D3A2D',
      accent_color: '#4CAF50',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  ocean: {
    id: 'ocean',
    name: t('themes.ocean'),
    config: {
      background_color: '#001F3F',
      text_color: '#F0F8FF',
      accent_color: '#7FDBFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  vintage: {
    id: 'vintage',
    name: t('themes.vintage'),
    config: {
      background_color: '#F4ECD8',
      text_color: '#4A3728',
      accent_color: '#8B4513',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  midnight: {
    id: 'midnight',
    name: t('themes.midnight'),
    config: {
      background_color: '#121212',
      text_color: '#B0B0B0',
      accent_color: '#BB86FC',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  sakura: {
    id: 'sakura',
    name: t('themes.sakura'),
    config: {
      background_color: '#FFF0F5',
      text_color: '#4A4A4A',
      accent_color: '#FF69B4',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  }
});

// 社交媒体预设尺寸
const getPresetSizes = (t) => [
  { name: t('presetSizes.wechat'), width: 1080, height: 1260 },
  { name: t('presetSizes.weibo'), width: 1080, height: 1920 },
  { name: t('presetSizes.instagram_square'), width: 1080, height: 1080 },
  { name: t('presetSizes.instagram_portrait'), width: 1080, height: 1350 },
  { name: t('presetSizes.xiaohongshu'), width: 1080, height: 1440 },
];

function App() {
  const { t, i18n } = useTranslation();
  const [markdownContent, setMarkdownContent] = useState(t('defaultMarkdown'));
  const THEMES = getThemes(t);
  const PRESET_SIZES = getPresetSizes(t);

  const [config, setConfig] = useState({
    canvas_width: 1080,
    canvas_height: 1920,
    background_color: '#FFFFFF',
    is_gradient: false,
    gradient_start: '#667eea',
    gradient_end: '#764ba2',
    gradient_angle: 135,
    text_color: '#333333',
    accent_color: '#007AFF',
    font_family: 'PingFang SC, -apple-system, sans-serif',
    font_size: 16,
    padding: 40,
    line_height: 1.6,
    paragraph_spacing: 20,
    author: '',
    timestamp: '',
    meta_position: 'bottom',
    watermark_text: '',
    watermark_opacity: 0.2,
    watermark_size: 16,
    watermark_angle: -30,
    watermark_color: '#888888',
    watermark_enable: false,
    watermark_gap: 120
  });
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [leftWidth, setLeftWidth] = useState(500);
  const [middleWidth, setMiddleWidth] = useState(1000);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const previewRef = useRef(null);
  const editorRef = useRef(null);

  // 工具栏操作函数
  const handleEditorAction = (type) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = markdownContent.substring(start, end);
    const before = markdownContent.substring(0, start);
    const after = markdownContent.substring(end);
    
    let newText = '';
    let selectionOffset = 0;
    let selectionLength = 0;

    switch (type) {
      case 'bold':
        newText = `**${selection || t('toolbar.boldText')}**`;
        selectionOffset = 2;
        selectionLength = selection ? selection.length : t('toolbar.boldText').length;
        break;
      case 'italic':
        newText = `*${selection || t('toolbar.italicText')}*`;
        selectionOffset = 1;
        selectionLength = selection ? selection.length : t('toolbar.italicText').length;
        break;
      case 'underline':
        newText = `<u>${selection || t('toolbar.underlineText')}</u>`;
        selectionOffset = 3;
        selectionLength = selection ? selection.length : t('toolbar.underlineText').length;
        break;
      case 'strikethrough':
        newText = `~~${selection || t('toolbar.strikethroughText')}~~`;
        selectionOffset = 2;
        selectionLength = selection ? selection.length : t('toolbar.strikethroughText').length;
        break;
      case 'h1':
        newText = `\n# ${selection || t('toolbar.h1Text')}\n`;
        selectionOffset = 3;
        selectionLength = selection ? selection.length : t('toolbar.h1Text').length;
        break;
      case 'h2':
        newText = `\n## ${selection || t('toolbar.h2Text')}\n`;
        selectionOffset = 4;
        selectionLength = selection ? selection.length : t('toolbar.h2Text').length;
        break;
      case 'h3':
        newText = `\n### ${selection || t('toolbar.h3Text')}\n`;
        selectionOffset = 5;
        selectionLength = selection ? selection.length : t('toolbar.h3Text').length;
        break;
      case 'quote':
        newText = `\n> ${selection || t('toolbar.quoteText')}\n`;
        selectionOffset = 3;
        selectionLength = selection ? selection.length : t('toolbar.quoteText').length;
        break;
      case 'code':
        newText = `\`${selection || t('toolbar.codeText')}\``;
        selectionOffset = 1;
        selectionLength = selection ? selection.length : t('toolbar.codeText').length;
        break;
      case 'codeblock':
        newText = `
\`\`\`javascript
${selection || t('toolbar.codeblockText')}
\`\`\`
`;
        selectionOffset = 15; // length of \n```javascript\n
        selectionLength = selection ? selection.length : t('toolbar.codeblockText').length;
        break;
      case 'link':
        newText = `[${selection || t('toolbar.linkText')}](https://)`;
        selectionOffset = 1;
        selectionLength = selection ? selection.length : t('toolbar.linkText').length;
        break;
      case 'image':
        newText = `![${selection || t('toolbar.imageText')}](https://)`;
        selectionOffset = 2;
        selectionLength = selection ? selection.length : t('toolbar.imageText').length;
        break;
      case 'ul':
        newText = `\n- ${selection || t('toolbar.listText')}\n`;
        selectionOffset = 3;
        selectionLength = selection ? selection.length : t('toolbar.listText').length;
        break;
      case 'ol':
        newText = `\n1. ${selection || t('toolbar.listText')}\n`;
        selectionOffset = 4;
        selectionLength = selection ? selection.length : t('toolbar.listText').length;
        break;
      case 'table':
        newText = `
| ${t('toolbar.col1')} | ${t('toolbar.col2')} |
| --- | --- |
| ${t('toolbar.cell')} | ${t('toolbar.cell')} |
`;
        selectionOffset = 3;
        selectionLength = t('toolbar.col1').length;
        break;
      default:
        return;
    }

    const newContent = before + newText + after;
    setMarkdownContent(newContent);

    // 重新聚焦并选中文字
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + selectionOffset, start + selectionOffset + selectionLength);
    }, 0);
  };

  // 面板调整逻辑
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newWidth = Math.max(250, Math.min(600, e.clientX));
        setLeftWidth(newWidth);
      } else if (isResizingRight) {
        const newWidth = Math.max(300, Math.min(1000, e.clientX - leftWidth));
        setMiddleWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = 'default';
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, leftWidth]);

  // 应用主题
  const applyTheme = (themeId) => {
    const theme = THEMES[themeId];
    if (theme) {
      setSelectedTheme(themeId);
      setConfig(prev => ({
        ...prev,
        is_gradient: false, // 默认重置渐变，除非主题中定义了渐变
        ...theme.config
      }));
    }
  };

  // 应用预设尺寸
  const applyPresetSize = (preset) => {
    setConfig(prev => ({
      ...prev,
      canvas_width: preset.width,
      canvas_height: preset.height
    }));
  };

  // 生成 Canvas 图片（复用逻辑）
  const generateCanvas = async () => {
    // 验证输入
    if (!markdownContent.trim()) {
      setError(t('errorEmptyContent'));
      return null;
    }
    
    if (markdownContent.length > 10000) {
      setError(t('errorContentTooLong'));
      return null;
    }
    
    if (!previewRef.current) {
      throw new Error(t('errorPreviewNotReady'));
    }

    // 使用 html2canvas 生成图片
    const canvas = await html2canvas(previewRef.current, {
      scale: 2, // 2倍缩放，提高清晰度
      backgroundColor: null,
      width: config.canvas_width,
      height: config.canvas_height,
      windowWidth: config.canvas_width,
      windowHeight: config.canvas_height,
      logging: false,
      useCORS: true, // 支持跨域图片
    });

    return canvas;
  };

  // 下载图片
  const downloadImage = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const canvas = await generateCanvas();
      if (!canvas) {
        setLoading(false);
        return;
      }

      // 转换为 base64 并下载
      const imageData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `markdown-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message || t('errorUnknown'));
      console.error('Error generating image:', err);
    } finally {
      setLoading(false);
    }
  };

  // 复制图片到剪贴板
  const copyImageToClipboard = async () => {
    setCopying(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const canvas = await generateCanvas();
      if (!canvas) {
        setCopying(false);
        return;
      }

      // 转换 canvas 为 Blob
      canvas.toBlob(async (blob) => {
        try {
          // 使用 Clipboard API 复制图片
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          
          setSuccessMessage(t('copySuccess'));
          // 3秒后清除成功提示
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          console.error('Error copying to clipboard:', err);
          setError(t('copyFailed'));
        } finally {
          setCopying(false);
        }
      }, 'image/png');
    } catch (err) {
      setError(err.message || t('copyFailed'));
      console.error('Error generating image for copy:', err);
      setCopying(false);
    }
  };

  // 重置配置
  const resetConfig = () => {
    setConfig({
      canvas_width: 1080,
      canvas_height: 1920,
      background_color: '#FFFFFF',
      is_gradient: false,
      gradient_start: '#667eea',
      gradient_end: '#764ba2',
      gradient_angle: 135,
      text_color: '#333333',
      accent_color: '#007AFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
      font_size: 16,
      padding: 40,
      line_height: 1.6,
      paragraph_spacing: 20,
      author: '',
      timestamp: '',
      meta_position: 'bottom',
      watermark_text: '',
      watermark_opacity: 0.2,
      watermark_size: 16,
      watermark_angle: -30,
      watermark_color: '#888888',
      watermark_enable: false,
      watermark_gap: 120
    });
    setSelectedTheme('light');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </div>
          <div className="language-switcher">
            <button 
              className={`lang-btn ${i18n.language === 'zh' ? 'active' : ''}`}
              onClick={() => i18n.changeLanguage('zh')}
            >
              中文
            </button>
            <button 
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => i18n.changeLanguage('en')}
            >
              English
            </button>
          </div>
        </div>
      </header>

      <div className="app-content">
        {/* 左侧：配置面板 */}
        <div className="panel config-panel" style={{ width: `${leftWidth}px`, flex: 'none' }}>
          <div className="config-section">
            <h2>{t('configPanel')}</h2>

            {/* 主题选择 */}
            <div className="config-group">
              <label>{t('selectTheme')}</label>
              <div className="theme-selector">
                {Object.values(THEMES).map(theme => (
                  <button
                    key={theme.id}
                    className={`theme-btn ${selectedTheme === theme.id ? 'active' : ''}`}
                    onClick={() => applyTheme(theme.id)}
                    style={{
                      background: theme.config.is_gradient 
                        ? `linear-gradient(${theme.config.gradient_angle}deg, ${theme.config.gradient_start}, ${theme.config.gradient_end})`
                        : theme.config.background_color,
                      color: theme.config.text_color,
                      borderColor: theme.config.accent_color
                    }}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 画布尺寸 */}
            <div className="config-group">
              <label>{t('canvasSize')}</label>
              <div className="preset-sizes">
                {PRESET_SIZES.map((preset, index) => (
                  <button
                    key={index}
                    className="preset-btn"
                    onClick={() => applyPresetSize(preset)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <div className="size-inputs">
                <input
                  type="number"
                  value={config.canvas_width}
                  onChange={(e) => setConfig({...config, canvas_width: parseInt(e.target.value)})}
                  placeholder={t('widthPlaceholder')}
                />
                <span>×</span>
                <input
                  type="number"
                  value={config.canvas_height}
                  onChange={(e) => setConfig({...config, canvas_height: parseInt(e.target.value)})}
                  placeholder={t('heightPlaceholder')}
                />
              </div>
            </div>

            {/* 字体设置 */}
            <div className="config-group">
              <label>{t('fontSize')}</label>
              <input
                type="range"
                min="12"
                max="32"
                value={config.font_size}
                onChange={(e) => setConfig({...config, font_size: parseInt(e.target.value)})}
              />
              <span className="value-display">{config.font_size}px</span>
            </div>

            {/* 颜色设置 */}
            <div className="config-group">
              <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  id="is_gradient"
                  checked={config.is_gradient}
                  onChange={(e) => setConfig({...config, is_gradient: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="is_gradient" style={{ marginBottom: 0, cursor: 'pointer', userSelect: 'none' }}>{t('gradientBackground')}</label>
              </div>
            </div>

            {!config.is_gradient ? (
              <div className="config-group">
                <label>{t('backgroundColor')}</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={config.background_color}
                    onChange={(e) => setConfig({...config, background_color: e.target.value})}
                  />
                  <input
                    type="text"
                    value={config.background_color}
                    onChange={(e) => setConfig({...config, background_color: e.target.value})}
                    className="color-input"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="config-group">
                  <label>{t('gradientStartColor')}</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={config.gradient_start}
                      onChange={(e) => setConfig({...config, gradient_start: e.target.value})}
                    />
                    <input
                      type="text"
                      value={config.gradient_start}
                      onChange={(e) => setConfig({...config, gradient_start: e.target.value})}
                      className="color-input"
                    />
                  </div>
                </div>
                <div className="config-group">
                  <label>{t('gradientEndColor')}</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={config.gradient_end}
                      onChange={(e) => setConfig({...config, gradient_end: e.target.value})}
                    />
                    <input
                      type="text"
                      value={config.gradient_end}
                      onChange={(e) => setConfig({...config, gradient_end: e.target.value})}
                      className="color-input"
                    />
                  </div>
                </div>
                <div className="config-group">
                  <label>{t('gradientAngle', { angle: config.gradient_angle })}</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={config.gradient_angle}
                    onChange={(e) => setConfig({...config, gradient_angle: parseInt(e.target.value)})}
                  />
                </div>
              </>
            )}

            <div className="config-group">
              <label>{t('textColor')}</label>
              <input
                type="color"
                value={config.text_color}
                onChange={(e) => setConfig({...config, text_color: e.target.value})}
              />
              <input
                type="text"
                value={config.text_color}
                onChange={(e) => setConfig({...config, text_color: e.target.value})}
                className="color-input"
              />
            </div>

            <div className="config-group">
              <label>{t('accentColor')}</label>
              <input
                type="color"
                value={config.accent_color}
                onChange={(e) => setConfig({...config, accent_color: e.target.value})}
              />
              <input
                type="text"
                value={config.accent_color}
                onChange={(e) => setConfig({...config, accent_color: e.target.value})}
                className="color-input"
              />
            </div>

            {/* 间距设置 */}
            <div className="config-group">
              <label>{t('padding')}</label>
              <input
                type="range"
                min="20"
                max="80"
                value={config.padding}
                onChange={(e) => setConfig({...config, padding: parseInt(e.target.value)})}
              />
              <span className="value-display">{config.padding}px</span>
            </div>

            <div className="config-group">
              <label>{t('lineHeight')}</label>
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={config.line_height}
                onChange={(e) => setConfig({...config, line_height: parseFloat(e.target.value)})}
              />
              <span className="value-display">{config.line_height}</span>
            </div>

            <div className="config-group">
              <label>{t('paragraphSpacing')}</label>
              <input
                type="range"
                min="10"
                max="40"
                value={config.paragraph_spacing}
                onChange={(e) => setConfig({...config, paragraph_spacing: parseInt(e.target.value)})}
              />
              <span className="value-display">{config.paragraph_spacing}px</span>
            </div>

            {/* 元信息 */}
            <div className="config-group">
              <label>{t('author')}</label>
              <input
                type="text"
                value={config.author}
                onChange={(e) => setConfig({...config, author: e.target.value})}
                placeholder={t('authorPlaceholder')}
              />
            </div>

            <div className="config-group">
              <label>{t('timestamp')}</label>
              <input
                type="text"
                value={config.timestamp}
                onChange={(e) => setConfig({...config, timestamp: e.target.value})}
                placeholder={t('timestampPlaceholder')}
              />
            </div>

            <div className="config-group">
              <label>{t('metaPosition')}</label>
              <select
                value={config.meta_position}
                onChange={(e) => setConfig({...config, meta_position: e.target.value})}
              >
                <option value="top">{t('metaTop')}</option>
                <option value="bottom">{t('metaBottom')}</option>
              </select>
            </div>

            {/* 水印设置 */}
            <div className="config-section-divider"></div>
            <div className="config-group">
              <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  id="watermark_enable"
                  checked={config.watermark_enable}
                  onChange={(e) => setConfig({...config, watermark_enable: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="watermark_enable" style={{ marginBottom: 0, cursor: 'pointer', userSelect: 'none' }}>{t('enableWatermark')}</label>
              </div>
            </div>

            {config.watermark_enable && (
              <>
                <div className="config-group">
                  <label>{t('watermarkContent')}</label>
                  <input
                    type="text"
                    value={config.watermark_text}
                    onChange={(e) => setConfig({...config, watermark_text: e.target.value})}
                    placeholder={t('watermarkPlaceholder')}
                  />
                </div>

                <div className="config-group">
                  <label>{t('watermarkColor')}</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={config.watermark_color}
                      onChange={(e) => setConfig({...config, watermark_color: e.target.value})}
                    />
                    <input
                      type="text"
                      value={config.watermark_color}
                      onChange={(e) => setConfig({...config, watermark_color: e.target.value})}
                      className="color-input"
                    />
                  </div>
                </div>

                <div className="config-group">
                  <label>{t('watermarkOpacity', { opacity: Math.round(config.watermark_opacity * 100) })}</label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={config.watermark_opacity}
                    onChange={(e) => setConfig({...config, watermark_opacity: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="config-group">
                  <label>{t('watermarkSize', { size: config.watermark_size })}</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={config.watermark_size}
                    onChange={(e) => setConfig({...config, watermark_size: parseInt(e.target.value)})}
                  />
                </div>

                <div className="config-group">
                  <label>{t('watermarkAngle', { angle: config.watermark_angle })}</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={config.watermark_angle}
                    onChange={(e) => setConfig({...config, watermark_angle: parseInt(e.target.value)})}
                  />
                </div>

                <div className="config-group">
                  <label>{t('watermarkGap', { gap: config.watermark_gap })}</label>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    value={config.watermark_gap}
                    onChange={(e) => setConfig({...config, watermark_gap: parseInt(e.target.value)})}
                  />
                </div>
              </>
            )}

            {/* 操作按钮 */}
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={resetConfig}>
                {t('resetConfig')}
              </button>
            </div>
          </div>
        </div>

        <div 
          className={`resizer ${isResizingLeft ? 'active' : ''}`} 
          onMouseDown={() => setIsResizingLeft(true)}
        />

        {/* 中间：编辑器 */}
        <div className="panel editor-panel" style={{ width: `${middleWidth}px`, flex: 'none' }}>
          <div className="editor-section">
            <div className="section-header">
              <h2>{t('editor')}</h2>
              <span className="char-count">{t('charCount', { count: markdownContent.length })}</span>
            </div>
            <div className="markdown-toolbar">
              <button onClick={() => handleEditorAction('h1')} title={t('toolbar.h1')}>H1</button>
              <button onClick={() => handleEditorAction('h2')} title={t('toolbar.h2')}>H2</button>
              <button onClick={() => handleEditorAction('h3')} title={t('toolbar.h3')}>H3</button>
              <div className="toolbar-divider"></div>
              <button onClick={() => handleEditorAction('bold')} title={t('toolbar.bold')}><strong>B</strong></button>
              <button onClick={() => handleEditorAction('italic')} title={t('toolbar.italic')}><em>I</em></button>
              <button onClick={() => handleEditorAction('underline')} title={t('toolbar.underline')} style={{textDecoration: 'underline'}}>U</button>
              <button onClick={() => handleEditorAction('strikethrough')} title={t('toolbar.strikethrough')} style={{textDecoration: 'line-through'}}>S</button>
              <div className="toolbar-divider"></div>
              <button onClick={() => handleEditorAction('quote')} title={t('toolbar.quote')}>“</button>
              <button onClick={() => handleEditorAction('code')} title={t('toolbar.code')}>{'<>'}</button>
              <button onClick={() => handleEditorAction('codeblock')} title={t('toolbar.codeblock')}>{'Code'}</button>
              <div className="toolbar-divider"></div>
              <button onClick={() => handleEditorAction('link')} title={t('toolbar.link')}>🔗</button>
              <button onClick={() => handleEditorAction('image')} title={t('toolbar.image')}>🖼️</button>
              <button onClick={() => handleEditorAction('table')} title={t('toolbar.table')}>📊</button>
              <div className="toolbar-divider"></div>
              <button onClick={() => handleEditorAction('ul')} title={t('toolbar.ul')}>•</button>
              <button onClick={() => handleEditorAction('ol')} title={t('toolbar.ol')}>1.</button>
            </div>
            <textarea
              ref={editorRef}
              className="markdown-editor"
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder={t('editorPlaceholder')}
            />
          </div>
        </div>

        <div 
          className={`resizer ${isResizingRight ? 'active' : ''}`} 
          onMouseDown={() => setIsResizingRight(true)}
        />

        {/* 右侧：预览和下载 */}
        <div className="panel preview-panel">
          <div className="preview-section">
            <h2>{t('preview')}</h2>
            <div className="preview-actions">
              <button 
                className="btn btn-success" 
                onClick={downloadImage} 
                disabled={loading || copying}
              >
                {loading ? t('generating') : t('downloadImage')}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={copyImageToClipboard} 
                disabled={loading || copying}
              >
                {copying ? t('copying') : t('copyImage')}
              </button>
            </div>
            <div className="preview-scroll-container">
              <div 
                ref={previewRef}
                className="preview-container"
                style={{
                  background: config.is_gradient 
                    ? `linear-gradient(${config.gradient_angle}deg, ${config.gradient_start}, ${config.gradient_end})`
                    : config.background_color,
                  color: config.text_color,
                  padding: `${config.padding}px`,
                  fontSize: `${config.font_size}px`,
                  lineHeight: config.line_height,
                  width: `${config.canvas_width}px`,
                  minHeight: `${config.canvas_height}px`,
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {(config.author || config.timestamp) && config.meta_position === 'top' && (
                  <div className="meta-info" style={{fontSize: `${config.font_size * 0.875}px`, marginBottom: `${config.padding}px`}}>
                    {config.author && <span>{config.author}</span>}
                    {config.author && config.timestamp && <span> · </span>}
                    {config.timestamp && <span>{config.timestamp}</span>}
                  </div>
                )}

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({...props}) => <h1 style={{color: config.accent_color}} {...props} />,
                    h2: ({...props}) => <h2 style={{color: config.accent_color}} {...props} />,
                    h3: ({...props}) => <h3 style={{color: config.accent_color}} {...props} />,
                    h4: ({...props}) => <h4 style={{color: config.accent_color}} {...props} />,
                    strong: ({...props}) => <strong style={{color: config.accent_color}} {...props} />,
                    em: ({...props}) => <em style={{fontStyle: 'italic', fontFamily: 'Georgia, "Times New Roman", STKaiti, KaiTi, serif'}} {...props} />,
                    blockquote: ({...props}) => (
                      <blockquote 
                        style={{
                          borderLeftColor: config.accent_color,
                          backgroundColor: config.background_color === '#FFFFFF' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)'
                        }} 
                        {...props} 
                      />
                    ),
                    del: ({...props}) => <del style={{color: config.accent_color}} {...props} />,
                    u: ({...props}) => <u style={{color: config.accent_color}} {...props} />,
                    a: ({...props}) => <a style={{color: config.accent_color}} {...props} />,
                    table: ({...props}) => <table style={{borderColor: config.accent_color}} {...props} />,
                    th: ({...props}) => <th style={{backgroundColor: config.accent_color, color: config.background_color}} {...props} />,
                    td: ({...props}) => <td style={{borderColor: config.accent_color}} {...props} />,
                    code: ({inline, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isDark = config.background_color === '#1a1a1a' || config.background_color === '#121212' || config.background_color === '#001F3F';
                      
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={isDark ? vscDarkPlus : vs}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: '20px 0',
                            borderRadius: '8px',
                            fontSize: `${config.font_size * 0.875}px`,
                            lineHeight: config.line_height
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code 
                          className={className} 
                          style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: `${config.font_size * 0.875}px`,
                            color: config.accent_color,
                            fontFamily: 'Menlo, Monaco, Courier New, monospace'
                          }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
                
                {(config.author || config.timestamp) && config.meta_position === 'bottom' && (
                  <div className="meta-info" style={{fontSize: `${config.font_size * 0.875}px`, marginTop: `${config.padding}px`}}>
                    {config.author && <span>{config.author}</span>}
                    {config.author && config.timestamp && <span> · </span>}
                    {config.timestamp && <span>{config.timestamp}</span>}
                  </div>
                )}

                {config.watermark_enable && config.watermark_text && (
                  <div 
                    className="watermark-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: 'none',
                      zIndex: 10,
                      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="${config.watermark_gap}" height="${config.watermark_gap}">
                          <text 
                            x="50%" 
                            y="50%" 
                            fill="${config.watermark_color}" 
                            font-size="${config.watermark_size}" 
                            font-family="sans-serif"
                            text-anchor="middle" 
                            dominant-baseline="middle"
                            opacity="${config.watermark_opacity}"
                            transform="rotate(${config.watermark_angle}, ${config.watermark_gap/2}, ${config.watermark_gap/2})"
                          >
                            ${config.watermark_text}
                          </text>
                        </svg>
                      `)}")`,
                      backgroundRepeat: 'repeat'
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
          
          {/* 成功提示 */}
          {successMessage && (
            <div className="success-message" style={{
              padding: '12px 20px',
              marginTop: '10px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
              border: '1px solid #c3e6cb',
              fontSize: '14px'
            }}>
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
