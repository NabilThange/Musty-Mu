"use client"

import type React from "react"

import { CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  title: string
  message: string
  action?: React.ReactNode
}

export function SuccessMessage({ title, message, action }: SuccessMessageProps) {
  return (
    <div className="min-h-screen bg-white font-mono flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="bg-green-600 border-8 border-black p-12 shadow-brutal">
          <CheckCircle className="h-24 w-24 text-white mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase">{title}</h1>
          <p className="text-xl font-bold text-white mb-8">{message}</p>
          {action && <div className="pt-6 border-t-4 border-white">{action}</div>}
        </div>
      </div>
    </div>
  )
}
