import { cva } from "class-variance-authority"

// Add these new component variants and utilities:

// Button variants for different contexts
export const buttonVariants = cva(
  "inline-flex items-center justify-center font-black uppercase tracking-tight border-4 border-black transition-all hover:translate-y-1 hover:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-white text-black shadow-brutal hover:bg-gray-100",
        primary: "bg-blue-600 text-white shadow-brutal hover:bg-blue-500",
        secondary: "bg-yellow-500 text-black shadow-brutal hover:bg-yellow-400",
        danger: "bg-red-600 text-white shadow-brutal hover:bg-red-500",
        success: "bg-green-600 text-white shadow-brutal hover:bg-green-500",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        default: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-12 py-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

// Card variants for different content types
export const cardVariants = cva("border-8 border-black shadow-brutal", {
  variants: {
    variant: {
      default: "bg-white",
      primary: "bg-blue-600 text-white",
      secondary: "bg-yellow-500 text-black",
      accent: "bg-red-600 text-white",
      muted: "bg-gray-100",
    },
    size: {
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})
