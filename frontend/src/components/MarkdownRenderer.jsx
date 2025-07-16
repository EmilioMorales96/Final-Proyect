import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

/**
 * MarkdownRenderer - Renders markdown content safely
 * Supports basic markdown features with sanitization
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Rendered markdown content
 */
export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {children}
            </h6>
          ),
          
          // Paragraph styles
          p: ({ children }) => (
            <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
              {children}
            </p>
          ),
          
          // List styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-3 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-3 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 dark:text-gray-300">
              {children}
            </li>
          ),
          
          // Emphasis styles
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
          
          // Code styles
          code: ({ children, className }) => {
            const isInline = !className?.includes('language-');
            
            if (isInline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-mono text-sm">
                  {children}
                </code>
              );
            }
            
            return (
              <code className="block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                {children}
              </code>
            );
          },
          
          // Pre styles for code blocks
          pre: ({ children }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          
          // Blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 dark:border-purple-400 pl-4 py-2 mb-4 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg">
              <div className="text-gray-700 dark:text-gray-300 italic">
                {children}
              </div>
            </blockquote>
          ),
          
          // Link styles
          a: ({ children, href }) => (
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors"
            >
              {children}
            </a>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-gray-200 dark:border-gray-700" />
          ),
          
          // Table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * MarkdownEditor - Provides a textarea with markdown preview
 * Shows both edit and preview modes
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current markdown value
 * @param {Function} props.onChange - Value change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.rows - Number of textarea rows
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Markdown editor with preview
 */
export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Enter markdown content...", 
  rows = 4,
  className = "",
  ...props 
}) {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`markdown-editor ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📝 Markdown Editor
          </label>
          <textarea
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
            {...props}
          />
          
          {/* Markdown Help */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <details className="cursor-pointer">
              <summary className="hover:text-gray-700 dark:hover:text-gray-300">📚 Markdown Help</summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
                <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">**bold**</code> → <strong>bold</strong></div>
                <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">*italic*</code> → <em>italic</em></div>
                <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded"># Heading</code> → Large heading</div>
                <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">## Subheading</code> → Medium heading</div>
                <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">- List item</code> → Bullet point</div>
                <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">[Link](url)</code> → Hyperlink</div>
                <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">`code`</code> → Inline code</div>
              </div>
            </details>
          </div>
        </div>
        
        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            👁️ Preview
          </label>
          <div className="min-h-[150px] p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-auto">
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="text-gray-400 dark:text-gray-500 italic text-sm">
                Preview will appear here as you type markdown...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
