import React from 'react';
import MetaInfo from './components/MetaInfo.jsx';
import MarkdownRenderer from './components/MarkdownRenderer.jsx';
import Watermark from './components/Watermark.jsx';
import './preview.css';

/**
 * Pure preview canvas component.
 * Props: { markdown, config, id }
 * Renders the preview div, MetaInfo, MarkdownRenderer, and Watermark.
 * Accepts a forwarded ref to the root div.
 * No imports from ui/, hooks/, or i18n/.
 */
const PreviewCanvas = React.forwardRef(function PreviewCanvas(
  { markdown, config, id = 'render-root' },
  ref
) {
  return (
    <div
      id={id}
      ref={ref}
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
      <MetaInfo config={config} position="top" />
      <MarkdownRenderer markdown={markdown} config={config} />
      <MetaInfo config={config} position="bottom" />
      <Watermark config={config} />
    </div>
  );
});

export default PreviewCanvas;
