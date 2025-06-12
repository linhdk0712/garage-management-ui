import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] shadow-sm",
        destructive:
          "bg-[#8B7355] text-[#EDEDE9] hover:bg-[#6B5B47] shadow-sm",
        outline:
          "border border-[#D6CCC2] bg-[#EDEDE9] text-[#5A4A42] hover:bg-[#E3D5CA] hover:border-[#D5BDAF]",
        secondary:
          "bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA]",
        ghost: "text-[#5A4A42] hover:bg-[#E3D5CA] hover:text-[#3D2C2E]",
        link: "text-[#8B7355] underline-offset-4 hover:underline hover:text-[#6B5B47]",
        // Minimalist variants
        primary: "bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] shadow-sm",
        success: "bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] shadow-sm",
        warning: "bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] shadow-sm",
        info: "bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, icon, fullWidth, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 