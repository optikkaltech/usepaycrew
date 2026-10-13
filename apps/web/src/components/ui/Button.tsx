import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px] min-w-[44px]';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-brand active:scale-[0.98]',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.98]',
      outline: 'border border-border bg-transparent hover:bg-secondary text-foreground active:scale-[0.98]',
      destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-2 text-label-sm',
      md: 'px-4 py-2.5 text-label-md',
      lg: 'px-6 py-3 text-label-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
