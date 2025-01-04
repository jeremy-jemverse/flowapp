import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary variants
        primary: 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800',
        'primary-outline': 'border-2 border-violet-600 text-violet-600 bg-transparent hover:bg-violet-50 active:bg-violet-100',
        'primary-ghost': 'text-violet-600 hover:bg-violet-50 active:bg-violet-100',
        'primary-link': 'text-violet-600 underline-offset-4 hover:underline p-0 h-auto',
        
        // Secondary variants
        secondary: 'bg-neutral-600 text-white hover:bg-neutral-700 active:bg-neutral-800',
        'secondary-outline': 'border-2 border-neutral-600 text-neutral-600 bg-transparent hover:bg-neutral-50 active:bg-neutral-100',
        'secondary-ghost': 'text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100',
        'secondary-link': 'text-neutral-600 underline-offset-4 hover:underline p-0 h-auto',
        
        // Success variants
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
        'success-outline': 'border-2 border-emerald-600 text-emerald-600 bg-transparent hover:bg-emerald-50 active:bg-emerald-100',
        'success-ghost': 'text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100',
        'success-link': 'text-emerald-600 underline-offset-4 hover:underline p-0 h-auto',
        
        // Warning variants
        warning: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700',
        'warning-outline': 'border-2 border-amber-500 text-amber-500 bg-transparent hover:bg-amber-50 active:bg-amber-100',
        'warning-ghost': 'text-amber-500 hover:bg-amber-50 active:bg-amber-100',
        'warning-link': 'text-amber-500 underline-offset-4 hover:underline p-0 h-auto',
        
        // Danger variants
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
        'danger-outline': 'border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-50 active:bg-red-100',
        'danger-ghost': 'text-red-600 hover:bg-red-50 active:bg-red-100',
        'danger-link': 'text-red-600 underline-offset-4 hover:underline p-0 h-auto',

        // Legacy variants for backward compatibility
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-sm',
        default: 'h-10 px-4',
        lg: 'h-11 px-5',
        xl: 'h-12 px-6',
        '2xl': 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
      loading: {
        true: 'relative text-transparent transition-none hover:text-transparent',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading,
    fullWidth,
    asChild = false, 
    leftIcon, 
    rightIcon, 
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };