"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has been here before
    const isReturningUser = localStorage.getItem("musty_returning_user")

    if (isReturningUser) {
      // Returning user - go straight to dashboard
      router.push("/dashboard")
    } else {
      // New user - show landing page
      router.push("/landing")
    }
  }, [router])

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-yellow-500 border-4 border-black rotate-12 animate-pulse"></div>
          <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 -rotate-12 animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-black font-mono">MUSTY</h1>
        <p className="font-bold font-mono">Loading...</p>
      </div>
    </div>
  )
}
