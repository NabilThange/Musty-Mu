import { RefreshCw } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg"
  text?: string
}

export function LoadingSpinner({ size = "default", text = "Loading..." }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <RefreshCw className={`${sizeClasses[size]} animate-spin`} />
      <span className="font-bold font-mono">{text}</span>
    </div>
  )
}
