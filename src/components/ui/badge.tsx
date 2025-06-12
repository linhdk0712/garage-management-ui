import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "border-[#D6CCC2] bg-[#D6CCC2] text-[#3D2C2E]",
        secondary:
          "border-[#E3D5CA] bg-[#E3D5CA] text-[#5A4A42]",
        destructive:
          "border-[#D5BDAF] bg-[#D5BDAF] text-[#3D2C2E]",
        outline: 
          "border-[#D6CCC2] bg-[#EDEDE9] text-[#5A4A42]",
        primary:
          "border-[#D5BDAF] bg-[#D5BDAF] text-[#3D2C2E]",
        success:
          "border-[#E3D5CA] bg-[#E3D5CA] text-[#3D2C2E]",
        warning:
          "border-[#D6CCC2] bg-[#D6CCC2] text-[#3D2C2E]",
        info:
          "border-[#D5BDAF] bg-[#D5BDAF] text-[#3D2C2E]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants } 