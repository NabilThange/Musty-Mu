import { CursorAreaExample } from "@/components/ui/cursor-area-example"
import { HookExample } from "./hook-example"

export default function CursorDemoPage() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-black mb-8 text-center">Custom Cursor Demo</h1>
      
      <div className="max-w-4xl mx-auto bg-black/10 p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Global Custom Cursor</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The custom cursor is now <strong>active across the entire website</strong></li>
          <li>It's 3px larger than the default cursor (24px vs 21px)</li>
          <li>It follows the Bauhaus Brutalism design with sharp edges and bold colors</li>
          <li>It animates on click (scales down to 75%)</li>
          <li><strong>Random Color:</strong> The cursor uses a random Bauhaus color on each page load</li>
          <li><strong>Element Override:</strong> Use <code className="bg-black/20 px-2 py-1 rounded">data-cursor="#colorcode"</code> to override the color on specific elements</li>
        </ul>
      </div>
      
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="bg-white/5 p-6 rounded mb-8">
          <h3 className="font-bold text-xl mb-4">Random Color on Page Load</h3>
          <p className="mb-4">Every time you load a page, the cursor will randomly choose one of these Bauhaus colors:</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#dc2626] rounded"></div>
              <span>Red</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#2563eb] rounded"></div>
              <span>Blue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#eab308] rounded"></div>
              <span>Yellow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#8b5cf6] rounded"></div>
              <span>Purple</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#10b981] rounded"></div>
              <span>Green</span>
            </div>
          </div>
          
          <h3 className="font-bold text-xl mb-4">Color Override Priority</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li><strong>Element data-cursor</strong>: Highest priority - uses this color when hovering over an element with this attribute</li>
            <li><strong>Random Page Color</strong>: Default - if no data-cursor attribute is found, uses the random color generated for the page</li>
          </ol>
        </div>
      </div>
      
      <CursorAreaExample />
      
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Using the Hook</h2>
        <HookExample />
      </div>
      
      <div className="mt-12 p-8 border-4 border-black">
        <h2 className="text-2xl font-bold mb-4">Implementation</h2>
        <p className="mb-4">Method 1: Add the data-cursor attribute to any element:</p>
        <pre className="bg-black/20 p-4 rounded overflow-auto mb-8">
          {`// Change cursor color on specific elements
<div data-cursor="#dc2626">
  <h3>This area uses the red cursor</h3>
</div>

// Change color only on hover for specific elements
<button data-cursor="#eab308">This button shows yellow cursor on hover</button>`}
        </pre>
        
        <p className="mb-4">Method 2: Use the hook for easier implementation:</p>
        <pre className="bg-black/20 p-4 rounded overflow-auto">
          {`import { useBauhausCursor } from "@/hooks/useBauhausCursor"

export function MyComponent() {
  // Use named themes: 'red', 'blue', 'yellow', 'green', 'purple'
  const { cursorProps } = useBauhausCursor({ theme: 'red' })
  
  // OR use any hex color
  const { cursorProps: customProps } = useBauhausCursor({ theme: '#ff00ff' })
  
  return (
    <div {...cursorProps}>
      <h3>This area uses the red cursor</h3>
      
      {/* Override parent cursor color on this button only */}
      <button data-cursor="#10b981">Green on hover</button>
    </div>
  )
}`}
        </pre>
      </div>
    </main>
  )
} 