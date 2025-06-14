"use client"

import Image from "next/image"

export default function GeometricMascot() {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Mascot Image with Animation */}
      <div className="animate-bounce-gentle">
        <Image
          src="/images/musty-mascot.png"
          alt="Musty - Your AI Study Buddy"
          width={160}
          height={160}
          className="hover:scale-105 transition-all duration-300 drop-shadow-brutal"
          priority
        />
      </div>

      {/* Speech Bubble - Positioned Below Mascot */}
      <div className="relative">
        <div className="bg-white border-4 border-black px-4 py-3 shadow-brutal-sm max-w-[180px] text-center">
          <p className="font-black text-sm text-black leading-tight">I'm Musty. Let's ace MU together! 🎓</p>
          {/* Speech bubble tail pointing up */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white"></div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
