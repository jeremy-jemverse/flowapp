import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    indeterminate?: boolean;
  }
>(({ className, indeterminate, checked, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked);
  const [isIndeterminate, setIsIndeterminate] = React.useState(indeterminate);

  React.useEffect(() => {
    setIsChecked(checked);
    setIsIndeterminate(indeterminate);
  }, [checked, indeterminate]);

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked);
        setIsIndeterminate(false);
        props.onCheckedChange?.(checked);
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {isIndeterminate ? (
          <Minus className="h-3 w-3" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label: string;
    labelPosition?: "left" | "right";
    indeterminate?: boolean;
  }
>(({ label, labelPosition = "right", className, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      {labelPosition === "left" && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Checkbox ref={ref} {...props} />
      {labelPosition === "right" && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
});

CheckboxWithLabel.displayName = "CheckboxWithLabel";

export { Checkbox, CheckboxWithLabel };