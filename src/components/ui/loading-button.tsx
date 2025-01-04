import * as React from "react";
import { Button } from "./button";
import type { ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(({ isLoading, loadingText, children, ...props }, ref) => {
  return (
    <Button ref={ref} isLoading={isLoading} loadingText={loadingText} {...props}>
      {children}
    </Button>
  );
});

LoadingButton.displayName = "LoadingButton";