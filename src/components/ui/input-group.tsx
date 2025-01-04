import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./typography";

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  warning?: string;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, label, required, error, warning, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <Label className="flex gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="flex gap-2">{children}</div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {warning && !error && <p className="text-sm text-warning">{warning}</p>}
      </div>
    );
  }
);

InputGroup.displayName = "InputGroup";

export { InputGroup };