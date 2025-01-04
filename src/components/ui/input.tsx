import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./typography";
import { Loader2 } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  warning?: string;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      warning,
      prefix,
      suffix,
      loading,
      icon,
      iconPosition = "end",
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputWrapperClasses = cn(
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      {
        "border-input": !error && !warning,
        "border-destructive ring-destructive/30": error,
        "border-warning ring-warning/30": !error && warning,
      },
      className
    );

    const renderAdornment = (content: React.ReactNode) => (
      <div className="flex items-center text-muted-foreground">{content}</div>
    );

    return (
      <div className="space-y-2">
        {label && (
          <Label className="flex gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="relative">
          <div className={inputWrapperClasses}>
            {prefix && renderAdornment(prefix)}
            {icon && iconPosition === "start" && renderAdornment(icon)}
            <input
              type={type}
              className={cn(
                "flex-1 border-0 bg-transparent p-0",
                "focus:outline-none focus:ring-0",
                "disabled:cursor-not-allowed",
                {
                  "pl-2": prefix || (icon && iconPosition === "start"),
                  "pr-2": suffix || (icon && iconPosition === "end") || loading,
                }
              )}
              ref={ref}
              disabled={disabled || loading}
              {...props}
            />
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {icon && iconPosition === "end" && !loading && renderAdornment(icon)}
            {suffix && renderAdornment(suffix)}
          </div>
          {error && (
            <p className="mt-1 text-sm text-destructive">{error}</p>
          )}
          {warning && !error && (
            <p className="mt-1 text-sm text-warning">{warning}</p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };