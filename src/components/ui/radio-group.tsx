import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-neutral-400",
        "text-primary ring-offset-background focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-teal-500",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-teal-500 text-teal-500" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormRadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroup> {
  options: RadioOption[];
  label?: string;
  orientation?: "horizontal" | "vertical";
  error?: string;
}

const FormRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  FormRadioGroupProps
>(({ options, label, orientation = "vertical", error, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-medium text-foreground">{label}</div>
      )}
      <RadioGroup
        ref={ref}
        className={cn(
          orientation === "horizontal" ? "flex gap-6" : "space-y-3",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-2",
              orientation === "horizontal" ? "mr-4" : ""
            )}
          >
            <RadioGroupItem
              value={option.value}
              disabled={option.disabled}
              id={option.value}
            />
            <label
              htmlFor={option.value}
              className={cn(
                "text-sm font-normal",
                option.disabled ? "text-neutral-500" : "text-foreground",
                "cursor-pointer"
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <div className="text-sm text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
});
FormRadioGroup.displayName = "FormRadioGroup";

export { RadioGroup, RadioGroupItem, FormRadioGroup };