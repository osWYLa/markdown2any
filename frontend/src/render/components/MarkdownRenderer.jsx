import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { isDarkBackground } from '../colorUtils.js';

/**
 * Pure markdown renderer component.
 * Props: { markdown, config }
 * No imports from ui/, hooks/, or i18n/.
 */
export default function MarkdownRenderer({ markdown, config }) {
  const isDark = isDarkBackground(config);

  return (
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
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
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
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              style={isDark ? vscDarkPlus : vs}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                padding: '2px 6px',
                borderRadius: '3px',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '0.9em',
              }}
              className={className}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
