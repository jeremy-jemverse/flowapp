import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-200/30 dark:bg-blue-900/30 dark:text-blue-100 [&>svg]:text-blue-600",
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-200/30 dark:bg-green-900/30 dark:text-green-100 [&>svg]:text-green-600",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-200/30 dark:bg-yellow-900/30 dark:text-yellow-100 [&>svg]:text-yellow-600",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-200/30 dark:bg-red-900/30 dark:text-red-100 [&>svg]:text-red-600",
        destructive: "border-destructive bg-destructive/10 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const icons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  destructive: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void;
}

export function Alert({
  className,
  variant,
  children,
  onClose,
  ...props
}: AlertProps) {
  const Icon = icons[variant || "default"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <div>{children}</div>
    </div>
  );
}