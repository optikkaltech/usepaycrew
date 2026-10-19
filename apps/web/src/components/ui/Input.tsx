import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-medium text-foreground/80">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="pointer-events-none absolute left-3 flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'min-h-[42px] w-full rounded-lg border border-input bg-background px-3 py-2 text-body-xs sm:text-body-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-9',
              error && 'border-destructive focus:border-destructive focus:ring-destructive',
              className,
            )}
            {...props}
          />
        </div>
        {error && <span className="text-caption text-destructive">{error}</span>}
        {hint && !error && <span className="text-caption text-muted-foreground">{hint}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
