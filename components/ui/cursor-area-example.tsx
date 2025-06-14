'use client'

import React from 'react'

export function CursorAreaExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {/* This area will use the default random cursor */}
      <div className="p-8 border-4 border-black bg-white text-black">
        <h3 className="text-xl font-bold mb-4">Default Random Cursor</h3>
        <p>This section uses the random color cursor.</p>
        <button className="mt-4 px-4 py-2 bg-black text-white">Default Button</button>
      </div>
      
      {/* This area uses a specific cursor color */}
      <div className="p-8 border-4 border-[#2563eb] bg-white text-black" data-cursor="#2563eb">
        <h3 className="text-xl font-bold mb-4">Blue Cursor Area</h3>
        <p>This section uses the blue cursor via data-cursor attribute.</p>
        <button className="mt-4 px-4 py-2 bg-[#2563eb] text-white">Blue Button</button>
      </div>
      
      {/* Example with data-cursor attribute */}
      <div className="p-8 border-4 border-black bg-white text-black">
        <h3 className="text-xl font-bold mb-4">Data Attribute Example</h3>
        <p>Hover over these buttons to see the cursor change color:</p>
        <div className="flex flex-wrap gap-4 mt-4">
          <button 
            data-cursor="#dc2626" 
            className="px-4 py-2 bg-[#dc2626] text-white"
          >
            Red Cursor
          </button>
          <button 
            data-cursor="#2563eb" 
            className="px-4 py-2 bg-[#2563eb] text-white"
          >
            Blue Cursor
          </button>
          <button 
            data-cursor="#eab308" 
            className="px-4 py-2 bg-[#eab308] text-black"
          >
            Yellow Cursor
          </button>
          <button 
            data-cursor="#10b981" 
            className="px-4 py-2 bg-[#10b981] text-white"
          >
            Green Cursor
          </button>
        </div>
      </div>
      
      {/* Example with entire area using data-cursor */}
      <div 
        className="p-8 border-4 bg-white text-black"
        data-cursor="#8b5cf6"
      >
        <h3 className="text-xl font-bold mb-4">Entire Area Override</h3>
        <p>This entire section uses a purple cursor via data-cursor.</p>
        <div className="mt-4 px-4 py-2 bg-[#8b5cf6] text-white">Purple Theme</div>
      </div>
    </div>
  )
} 