'use client';

import { useMemo } from 'react';
import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return useMemo(
    () => ({
      success: (message: string, description?: string) => {
        sonnerToast.success(message, { description });
      },
      error: (message: string, description?: string) => {
        sonnerToast.error(message, { description });
      },
      info: (message: string, description?: string) => {
        sonnerToast.info(message, { description });
      },
      warning: (message: string, description?: string) => {
        sonnerToast.warning(message, { description });
      },
    }),
    [],
  );
}
