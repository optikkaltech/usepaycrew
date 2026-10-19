'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { InfoIcon, ShieldAlertIcon, CheckCircleIcon, XIcon } from '@/assets';

export type SystemBannerType = 'info' | 'warning' | 'success' | 'maintenance';

export interface SystemBannerProps {
  type?: SystemBannerType;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  className?: string;
}

export function SystemBanner({
  type = 'info',
  title,
  message,
  actionLabel,
  onAction,
  dismissible = true,
  className,
}: SystemBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const icons = {
    info: <InfoIcon className="h-4 w-4 text-brand-sky shrink-0" />,
    warning: <ShieldAlertIcon className="h-4 w-4 text-warning shrink-0" />,
    success: <CheckCircleIcon className="h-4 w-4 text-success shrink-0" />,
    maintenance: <ShieldAlertIcon className="h-4 w-4 text-warning shrink-0 animate-pulse" />,
  };

  const styleClasses = {
    info: 'bg-brand-sky/10 border-brand-sky/20 text-brand-sky',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    success: 'bg-success/10 border-success/20 text-success',
    maintenance: 'bg-amber-500/10 border-amber-500/25 text-amber-500',
  };

  return (
    <div
      role="alert"
      className={clsx(
        'flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-body-xs font-medium transition-all select-none',
        styleClasses[type],
        className,
      )}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        {icons[type]}
        <div className="flex items-center gap-2 flex-wrap text-foreground">
          {title && <span className="font-bold">{title}:</span>}
          <span className="text-muted-foreground">{message}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-caption font-bold text-foreground underline underline-offset-2 hover:opacity-80 cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
