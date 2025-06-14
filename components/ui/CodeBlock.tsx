import React, { useState } from 'react'

interface CodeBlockProps {
  children: string
  language?: string
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative bg-black text-white border-4 border-black shadow-brutal p-4 font-mono text-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-2 border-b-2 border-white/20 pb-2">
        <span className="text-xs font-bold uppercase text-yellow-400">
          {language?.toUpperCase() || 'CODE'}
        </span>
        <button
          onClick={copyToClipboard}
          className="text-xs bg-white text-black px-2 py-1 border-2 border-black hover:bg-yellow-400"
        >
          {copied ? 'Copied!' : '⧉ Copy'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock 