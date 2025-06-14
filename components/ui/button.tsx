import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-black uppercase tracking-tight border-4 border-black transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white text-black shadow-brutal hover:bg-gray-100 hover:translate-y-1 hover:shadow-none",
        primary: "bg-blue-600 text-white shadow-brutal hover:bg-blue-500 hover:translate-y-1 hover:shadow-none",
        secondary: "bg-yellow-500 text-black shadow-brutal hover:bg-yellow-400 hover:translate-y-1 hover:shadow-none",
        destructive: "bg-red-600 text-white shadow-brutal hover:bg-red-500 hover:translate-y-1 hover:shadow-none",
        success: "bg-green-600 text-white shadow-brutal hover:bg-green-500 hover:translate-y-1 hover:shadow-none",
        outline: "border-4 border-black bg-white text-black hover:bg-gray-100 hover:translate-y-1",
        ghost: "border-0 shadow-none hover:bg-gray-100",
        link: "border-0 shadow-none text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-12 py-6 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
