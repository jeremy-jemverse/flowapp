import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Textarea, TextareaProps } from "./textarea";

interface FormTextareaProps extends TextareaProps {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, required, error, description, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="flex gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Textarea
          ref={ref}
          error={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export { FormTextarea };