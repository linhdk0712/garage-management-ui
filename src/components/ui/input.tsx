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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              {
                "pl-10": LeftIcon,
                "pr-10": RightIcon,
                "border-red-300": error,
                "border-gray-300": !error,
                "bg-gray-50 text-gray-500": disabled,
                "w-full": fullWidth,
              },
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={`${props.id}-helper ${props.id}-error`}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              className={cn(
                "absolute inset-y-0 right-0 pr-3 flex items-center",
                onRightIconClick ? "cursor-pointer" : "pointer-events-none"
              )}
              onClick={onRightIconClick}
              aria-label="Toggle input action"
            >
              <RightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
        {(helperText || error) && (
          <div className="mt-1.5">
            {helperText && !error && (
              <p id={`${props.id}-helper`} className="text-sm text-gray-600 dark:text-gray-400">
                {helperText}
              </p>
            )}
            {error && (
              <p id={`${props.id}-error`} className="text-sm text-red-600 dark:text-red-400">
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