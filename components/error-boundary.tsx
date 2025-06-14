"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white font-mono flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-red-600 text-white border-8 border-black p-8 shadow-brutal">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl font-black mb-4">OOPS! SOMETHING BROKE</h1>
              <p className="font-bold mb-6">
                Don't worry, it's not your fault. Our engineers are probably fixing this right now.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-white text-black border-4 border-black font-bold"
              >
                TRY AGAIN
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
