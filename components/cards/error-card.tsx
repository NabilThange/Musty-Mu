"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

export interface ErrorCardProps {
  message?: string
  onRetry?: () => void
}

export function ErrorCard({ message = "Something went wrong", onRetry }: ErrorCardProps) {
  return (
    <div className="bg-red-100 border-8 border-red-600 p-6 shadow-brutal text-center">
      <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-600" />
      <h3 className="text-2xl font-black mb-2 text-red-800">ERROR</h3>
      <p className="font-bold text-red-700 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white border-4 border-black px-6 py-3 font-black hover:bg-red-500 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="h-5 w-5" />
          TRY AGAIN
        </button>
      )}
    </div>
  )
}
