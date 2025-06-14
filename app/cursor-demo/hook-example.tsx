'use client'

import { useBauhausCursor } from "@/hooks/useBauhausCursor"

export function HookExample() {
  const { cursorProps: redCursorProps } = useBauhausCursor({ theme: 'red' })
  const { cursorProps: blueCursorProps } = useBauhausCursor({ theme: 'blue' })
  const { cursorProps: yellowCursorProps } = useBauhausCursor({ theme: 'yellow' })
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        {...redCursorProps}
        className="p-6 border-4 border-[#dc2626] flex flex-col items-center"
      >
        <h3 className="text-xl font-bold mb-4">Red Theme</h3>
        <p className="text-center mb-4">Using data-cursor="#dc2626"</p>
        <button className="px-4 py-2 bg-[#dc2626] text-white">Red Button</button>
      </div>
      
      <div 
        {...blueCursorProps}
        className="p-6 border-4 border-[#2563eb] flex flex-col items-center"
      >
        <h3 className="text-xl font-bold mb-4">Blue Theme</h3>
        <p className="text-center mb-4">Using data-cursor="#2563eb"</p>
        <button className="px-4 py-2 bg-[#2563eb] text-white">Blue Button</button>
      </div>
      
      <div 
        {...yellowCursorProps}
        className="p-6 border-4 border-[#eab308] flex flex-col items-center"
      >
        <h3 className="text-xl font-bold mb-4">Yellow Theme</h3>
        <p className="text-center mb-4">Using data-cursor="#eab308"</p>
        <button 
          className="px-4 py-2 bg-[#eab308] text-black"
          data-cursor="#10b981" // Override parent's color only while hovering
        >
          Green on Hover
        </button>
      </div>
    </div>
  )
} 