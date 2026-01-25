import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2canvas from 'html2canvas';
import './App.css';

// 预设主题
const THEMES = {
  light: {
    id: 'light',
    name: '简约明亮',
    config: {
      background_color: '#FFFFFF',
      text_color: '#333333',
      accent_color: '#007AFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  dark: {
    id: 'dark',
    name: '深色优雅',
    config: {
      background_color: '#1a1a1a',
      text_color: '#E5E5E5',
      accent_color: '#4A9EFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  warm: {
    id: 'warm',
    name: '温暖舒适',
    config: {
      background_color: '#FFF8F0',
      text_color: '#5D4E37',
      accent_color: '#D2691E',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  forest: {
    id: 'forest',
    name: '清新森系',
    config: {
      background_color: '#F0F9F0',
      text_color: '#2D3A2D',
      accent_color: '#4CAF50',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  ocean: {
    id: 'ocean',
    name: '深邃海洋',
    config: {
      background_color: '#001F3F',
      text_color: '#F0F8FF',
      accent_color: '#7FDBFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  vintage: {
    id: 'vintage',
    name: '复古书卷',
    config: {
      background_color: '#F4ECD8',
      text_color: '#4A3728',
      accent_color: '#8B4513',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  midnight: {
    id: 'midnight',
    name: '深夜静谧',
    config: {
      background_color: '#121212',
      text_color: '#B0B0B0',
      accent_color: '#BB86FC',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  sakura: {
    id: 'sakura',
    name: '浪漫樱花',
    config: {
      background_color: '#FFF0F5',
      text_color: '#4A4A4A',
      accent_color: '#FF69B4',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  }
};

// 社交媒体预设尺寸
const PRESET_SIZES = [
  { name: '微信朋友圈', width: 1080, height: 1260 },
  { name: '微博竖图', width: 1080, height: 1920 },
  { name: 'Instagram 方图', width: 1080, height: 1080 },
  { name: 'Instagram 竖图', width: 1080, height: 1350 },
  { name: '小红书', width: 1080, height: 1440 },
];

function App() {
  const [markdownContent, setMarkdownContent] = useState('# 欢迎使用 Markdown 转图片生成器\n\n这是一个**简单**的示例。\n\n## 支持的功能\n\n- 无序列表项 1\n- 无序列表项 2\n\n1. 有序列表项 1\n2. 有序列表项 2\n\n这里有*斜体*和**粗体**文本。\n\n### 表格功能\n\n| 功能 | 支持 | 说明 |\n|------|------|------|\n| 标题 | ✅ | H1-H6 |\n| 列表 | ✅ | 有序/无序 |\n| 表格 | ✅ | GFM 语法 |\n| 链接 | ✅ | [文本](链接) |\n\n[这是一个链接](https://example.com)');
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
    meta_position: 'bottom'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [leftWidth, setLeftWidth] = useState(350);
  const [middleWidth, setMiddleWidth] = useState(600);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const previewRef = useRef(null);

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

  // 下载图片
  const downloadImage = async () => {
    setLoading(true);
    setError(null);
    
    // 验证输入
    if (!markdownContent.trim()) {
      setError('请输入 Markdown 内容');
      setLoading(false);
      return;
    }
    
    if (markdownContent.length > 10000) {
      setError('内容过长,请控制在 10000 字符以内');
      setLoading(false);
      return;
    }
    
    try {
      if (!previewRef.current) {
        throw new Error('预览容器未就绪');
      }

      // 使用 html2canvas 生成图片
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // 2倍缩放，提高清晰度
        backgroundColor: config.background_color,
        width: config.canvas_width,
        height: config.canvas_height,
        windowWidth: config.canvas_width,
        windowHeight: config.canvas_height,
        logging: false,
        useCORS: true, // 支持跨域图片
      });

      // 转换为 base64 并下载
      const imageData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `markdown-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message || '生成图片时发生未知错误');
      console.error('Error generating image:', err);
    } finally {
      setLoading(false);
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
      meta_position: 'bottom'
    });
    setSelectedTheme('light');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Markdown 转图片生成器</h1>
        <p>将 Markdown 文本转换为精美图片,适合社交媒体分享</p>
      </header>

      <div className="app-content">
        {/* 左侧：配置面板 */}
        <div className="panel config-panel" style={{ width: `${leftWidth}px`, flex: 'none' }}>
          <div className="config-section">
            <h2>配置面板</h2>

            {/* 主题选择 */}
            <div className="config-group">
              <label>选择主题</label>
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
              <label>画布尺寸</label>
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
                  placeholder="宽度"
                />
                <span>×</span>
                <input
                  type="number"
                  value={config.canvas_height}
                  onChange={(e) => setConfig({...config, canvas_height: parseInt(e.target.value)})}
                  placeholder="高度"
                />
              </div>
            </div>

            {/* 字体设置 */}
            <div className="config-group">
              <label>字体大小</label>
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
                <label htmlFor="is_gradient" style={{ marginBottom: 0, cursor: 'pointer', userSelect: 'none' }}>使用渐变背景</label>
              </div>
            </div>

            {!config.is_gradient ? (
              <div className="config-group">
                <label>背景颜色</label>
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
                  <label>渐变起始颜色</label>
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
                  <label>渐变结束颜色</label>
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
                  <label>渐变角度 ({config.gradient_angle}°)</label>
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
              <label>文字颜色</label>
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
              <label>强调色</label>
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
              <label>内边距</label>
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
              <label>行间距</label>
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
              <label>段落间距</label>
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
              <label>作者</label>
              <input
                type="text"
                value={config.author}
                onChange={(e) => setConfig({...config, author: e.target.value})}
                placeholder="输入作者名称"
              />
            </div>

            <div className="config-group">
              <label>时间</label>
              <input
                type="text"
                value={config.timestamp}
                onChange={(e) => setConfig({...config, timestamp: e.target.value})}
                placeholder="输入时间信息"
              />
            </div>

            <div className="config-group">
              <label>元信息位置</label>
              <select
                value={config.meta_position}
                onChange={(e) => setConfig({...config, meta_position: e.target.value})}
              >
                <option value="top">顶部</option>
                <option value="bottom">底部</option>
              </select>
            </div>

            {/* 操作按钮 */}
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={resetConfig}>
                🔄 重置配置
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
              <h2>Markdown 编辑器</h2>
              <span className="char-count">{markdownContent.length} 字符</span>
            </div>
            <textarea
              className="markdown-editor"
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder="在此输入 Markdown 内容..."
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
            <h2>预览</h2>
            <div className="preview-actions">
              <button 
                className="btn btn-success" 
                onClick={downloadImage} 
                disabled={loading}
              >
                {loading ? '生成中...' : '⬇️ 下载图片'}
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
                  components={{
                    h1: ({...props}) => <h1 style={{color: config.accent_color}} {...props} />,
                    h2: ({...props}) => <h2 style={{color: config.accent_color}} {...props} />,
                    h3: ({...props}) => <h3 style={{color: config.accent_color}} {...props} />,
                    h4: ({...props}) => <h4 style={{color: config.accent_color}} {...props} />,
                    strong: ({...props}) => <strong style={{color: config.accent_color}} {...props} />,
                    a: ({...props}) => <a style={{color: config.accent_color}} {...props} />,
                    table: ({...props}) => <table style={{borderColor: config.accent_color}} {...props} />,
                    th: ({...props}) => <th style={{backgroundColor: config.accent_color, color: config.background_color}} {...props} />,
                    td: ({...props}) => <td style={{borderColor: config.accent_color}} {...props} />,
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
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
