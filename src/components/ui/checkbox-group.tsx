import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  options: Array<{ id: string; label: string }>;
  values: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, label, options, values, onChange, disabled, ...props }, ref) => {
    const allChecked = options.length === values.length;
    const someChecked = values.length > 0 && !allChecked;

    const handleParentChange = () => {
      if (allChecked) {
        onChange([]);
      } else {
        onChange(options.map((option) => option.id));
      }
    };

    const handleChildChange = (optionId: string, checked: boolean) => {
      if (checked) {
        onChange([...values, optionId]);
      } else {
        onChange(values.filter((id) => id !== optionId));
      }
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked}
              onCheckedChange={handleParentChange}
              disabled={disabled}
            />
            <label className="text-sm font-medium leading-none">{label}</label>
          </div>
        )}
        <div className="space-y-1 pl-6">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={values.includes(option.id)}
                onCheckedChange={(checked) =>
                  handleChildChange(option.id, checked as boolean)
                }
                disabled={disabled}
              />
              <label
                htmlFor={option.id}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };