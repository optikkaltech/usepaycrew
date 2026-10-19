'use client';

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { XIcon } from '@/assets';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={clsx(
          'relative w-full rounded-2xl bg-card border border-black/[0.08] dark:border-white/[0.08] p-5 sm:p-6 shadow-xl',
          'flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto z-10',
          sizeClasses[size],
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
            <div>
              {title && (
                <h3 id="modal-title" className="text-display-xs font-bold text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p id="modal-description" className="mt-0.5 text-body-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
