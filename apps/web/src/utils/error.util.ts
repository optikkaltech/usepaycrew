import { AppStrings } from '@/assets';

export interface NormalizedError {
  message: string;
  statusCode?: number;
  fieldErrors?: Record<string, string>;
}

export function normalizeError(error: unknown): NormalizedError {
  if (!error) {
    return { message: AppStrings.errors.generic };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (error instanceof Error) {
    return { message: error.message || AppStrings.errors.generic };
  }

  if (typeof error === 'object' && 'message' in (error as any)) {
    const errObj = error as any;
    return {
      message: Array.isArray(errObj.message) ? errObj.message[0] : errObj.message,
      statusCode: errObj.statusCode,
      fieldErrors: errObj.errors,
    };
  }

  return { message: AppStrings.errors.generic };
}
