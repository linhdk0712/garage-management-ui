import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label,
    helperText,
    error,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    onRightIconClick,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-[#5A4A42] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-[#8B7355]" />
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-[#EDEDE9] px-3 py-2 text-sm transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8B7355] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              {
                "pl-10": LeftIcon,
                "pr-10": RightIcon,
                "border-[#D5BDAF] focus-visible:ring-[#D5BDAF]": error,
                "border-[#D6CCC2] hover:border-[#D5BDAF]": !error,
                "bg-[#F5EBE0] text-[#8B7355]": disabled,
                "w-full": fullWidth,
              },
              className
            )}
            ref={ref}
            disabled={disabled}
            {...(error && { "aria-invalid": "true" })}
            aria-describedby={`${props.id}-helper ${props.id}-error`}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              className={cn(
                "absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200",
                onRightIconClick ? "cursor-pointer hover:text-[#6B5B47]" : "pointer-events-none"
              )}
              onClick={onRightIconClick}
              aria-label="Toggle input action"
            >
              <RightIcon className="h-5 w-5 text-[#8B7355]" />
            </button>
          )}
        </div>
        {(helperText || error) && (
          <div className="mt-2">
            {helperText && !error && (
              <p id={`${props.id}-helper`} className="text-sm text-[#6B5B47]">
                {helperText}
              </p>
            )}
            {error && (
              <p id={`${props.id}-error`} className="text-sm text-[#8B7355]">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input } 