import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  characterCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, characterCount, maxLength, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && [
              "border-red-500",
              "focus-visible:ring-red-500",
              "placeholder:text-red-500",
            ],
            className
          )}
          ref={ref}
          onChange={handleInput}
          maxLength={maxLength}
          {...props}
        />
        {characterCount && maxLength && (
          <div
            className={cn(
              "absolute bottom-1 right-1 text-xs",
              error ? "text-red-500" : "text-muted-foreground",
              charCount > maxLength && "text-red-500"
            )}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };