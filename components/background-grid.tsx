"use client"

export default function BackgroundGrid() {
  return (
    <div className="absolute inset-0 opacity-5">
      {/* Bauhaus Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
               linear-gradient(90deg, #000 1px, transparent 1px),
               linear-gradient(180deg, #000 1px, transparent 1px)
             `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Geometric Shapes Scattered */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-300 border-2 border-black rotate-45 opacity-30"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-red-600 border-2 border-black opacity-30"></div>
      <div className="absolute bottom-32 left-1/4 w-10 h-10 bg-blue-600 border-2 border-black rounded-full opacity-30"></div>
      <div className="absolute bottom-20 right-1/3 w-12 h-6 bg-yellow-300 border-2 border-black opacity-30"></div>
    </div>
  )
}
