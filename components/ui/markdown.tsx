import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import CodeBlock from './CodeBlock'

// Install these with: npm install react-markdown react-syntax-highlighter @types/react-syntax-highlighter
interface MarkdownProps {
  children: string
}

const CustomMarkdown: React.FC<MarkdownProps> = ({ children }) => {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-full text-black">
      <ReactMarkdown
        components={{
          // Custom heading styles with Bauhaus Brutalist design
          h1: ({ node, ...props }) => (
            <h1 
              {...props} 
              className="text-2xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4" 
            />
          ),
          h2: ({ node, ...props }) => (
            <h2 
              {...props} 
              className="text-xl font-bold uppercase tracking-tight border-b-2 border-black pb-1 mb-3" 
            />
          ),
          // Enhanced code block rendering
          code(props: any) {
            const { node, inline, className, children } = props
            const match = /language-(\w+)/.exec(className || '')
            
            // Inline code
            if (inline) {
              return (
                <code 
                  className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm border-2 border-black" 
                >
                  {children}
                </code>
              )
            }
            
            // Code block with new CodeBlock component
            if (match) {
              return (
                <CodeBlock language={match[1]}>
                  {String(children).trim()}
                </CodeBlock>
              )
            }
            
            // Fallback for unrecognized code
            return (
              <code 
                className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm" 
              >
                {children}
              </code>
            )
          },
          // Make links open in new tab with Bauhaus styling
          a: ({ node, ...props }) => (
            <a 
              {...props} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 font-bold border-b-2 border-blue-600 hover:border-blue-800 transition-colors"
            />
          ),
          // List styles with Brutalist design
          ul: ({ node, ...props }) => (
            <ul 
              {...props} 
              className="list-disc list-inside space-y-2 pl-4 border-l-4 border-black" 
            />
          ),
          ol: ({ node, ...props }) => (
            <ol 
              {...props} 
              className="list-decimal list-inside space-y-2 pl-4 border-l-4 border-black" 
            />
          ),
          // Strong and emphasis with bold Bauhaus style
          strong: ({ node, ...props }) => (
            <strong 
              {...props} 
              className="font-black text-black dark:text-black uppercase tracking-tight" 
              style={{ color: 'black' }}
            />
          ),
          em: ({ node, ...props }) => (
            <em 
              {...props} 
              className="font-bold italic text-black dark:text-black" 
              style={{ color: 'black' }}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default CustomMarkdown 