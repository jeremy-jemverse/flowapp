import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import type { ButtonProps } from "./button";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  orientation?: "horizontal" | "vertical";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "inline-flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
          className
        )}
        ref={ref}
        role="group"
        {...props}
      >
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              variant,
              size,
              className: cn(
                "first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none",
                orientation === "vertical"
                  ? "first:rounded-b-none last:rounded-t-none -mt-[1px] first:mt-0"
                  : "first:rounded-r-none last:rounded-l-none -ml-[1px] first:ml-0",
                child.props.className
              ),
            });
          }
          return child;
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };