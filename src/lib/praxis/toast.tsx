'use client';

/**
 * Centralized toast notifications for Praxis.
 *
 * All user-facing errors and success messages should go through this
 * module to ensure consistent UX across the learning platform.
 */
import { toast as sonnerToast } from 'sonner';

/** Error codes returned by Praxis API endpoints. */
export type PraxisErrorCode =
  | 'NOT_AUTHENTICATED'
  | 'GENERATION_NOT_ALLOWED'
  | 'INVALID_BODY'
  | 'UPSTREAM_FAILED'
  | 'BUDGET_EXCEEDED'
  | 'TOPIC_EXISTS'
  | 'TOPIC_NOT_FOUND'
  | 'UNIT_NOT_FOUND'
  | 'NOT_OWNER'
  | 'UNIT_GENERATING'
  | 'BLOCK_NOT_FOUND';

interface ErrorMapping {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Human-friendly error messages for each error code.
 * Keep these actionable and concise.
 */
const ERROR_MAP: Record<PraxisErrorCode, ErrorMapping> = {
  NOT_AUTHENTICATED: {
    title: 'Session expired',
    description: 'Please sign in again to continue.',
  },
  GENERATION_NOT_ALLOWED: {
    title: 'Generation not enabled',
    description: 'Contact the admin to request access to AI-generated content.',
  },
  INVALID_BODY: {
    title: 'Invalid request',
    description: 'Please check your input and try again.',
  },
  UPSTREAM_FAILED: {
    title: 'Service temporarily unavailable',
    description: 'The AI service is having issues. Please try again shortly.',
  },
  BUDGET_EXCEEDED: {
    title: 'Budget limit reached',
    description: 'Monthly generation budget exceeded. Contact admin.',
  },
  TOPIC_EXISTS: {
    title: 'Topic already exists',
    description: 'You already have a topic with this content.',
  },
  TOPIC_NOT_FOUND: {
    title: 'Topic not found',
    description: 'The topic may have been deleted or you do not have access.',
  },
  UNIT_NOT_FOUND: {
    title: 'Unit not found',
    description: 'The unit may have been removed or you do not have access.',
  },
  NOT_OWNER: {
    title: 'Access denied',
    description: 'You do not have permission to access this content.',
  },
  UNIT_GENERATING: {
    title: 'Content still generating',
    description: 'Please wait a moment and refresh the page.',
  },
  BLOCK_NOT_FOUND: {
    title: 'Block not found',
    description: 'The content block may have been removed.',
  },
};

/**
 * Parse an API error response and extract the error code and message.
 */
export function parseApiError(
  err: unknown,
): { code: PraxisErrorCode | null; message: string } {
  // Handle fetch response errors with our standard format
  if (err instanceof Error && 'code' in err) {
    const code = (err as { code: string }).code as PraxisErrorCode;
    if (code in ERROR_MAP) {
      return { code, message: err.message };
    }
  }

  // Handle HTTP status codes that map to specific error types
  if (err instanceof Error && err.message.includes('HTTP 429')) {
    return {
      code: null,
      message: 'Rate limit exceeded. Please wait a moment and try again.',
    };
  }

  if (err instanceof Error && err.message.includes('OpenRouter 429')) {
    return {
      code: null,
      message: 'AI service rate limited. Please try again shortly.',
    };
  }

  // Default: no known code, return the message as-is
  return {
    code: null,
    message: err instanceof Error ? err.message : 'An unexpected error occurred',
  };
}

/**
 * Show an error toast from an API error.
 * This centralizes all error handling for consistent UX.
 */
export function showApiError(
  err: unknown,
  options?: {
    /** Override the retry action. If provided, adds a "Try again" button. */
    onRetry?: () => void;
    /** Additional description to append to the default message. */
    description?: string;
  },
): void {
  const { code, message } = parseApiError(err);

  // Use mapped message if we have this code, otherwise use the raw message
  const mapping = code ? ERROR_MAP[code] : null;
  const title = mapping?.title ?? 'Something went wrong';
  const description = options?.description
    ? `${mapping?.description ?? message} ${options.description}`
    : (mapping?.description ?? message);

  sonnerToast.error(title, {
    description,
    ...(options?.onRetry && {
      action: {
        label: 'Try again',
        onClick: options.onRetry,
      },
    }),
    duration: code === 'GENERATION_NOT_ALLOWED' || code === 'NOT_AUTHENTICATED' ? 8000 : 5000,
  });
}

/**
 * Show a success toast.
 */
export function showSuccess(
  title: string,
  options?: {
    description?: string;
    duration?: number;
  },
): void {
  sonnerToast.success(title, {
    description: options?.description,
    duration: options?.duration ?? 4000,
  });
}

/**
 * Show an informational toast.
 */
export function showInfo(
  title: string,
  options?: {
    description?: string;
    duration?: number;
  },
): void {
  sonnerToast.info(title, {
    description: options?.description,
    duration: options?.duration ?? 4000,
  });
}

/**
 * Show a loading toast that can be updated or dismissed.
 * Returns the toast ID for later updates.
 */
export function showLoading(
  title: string,
  options?: {
    description?: string;
  },
): string | number {
  return sonnerToast.loading(title, {
    description: options?.description,
  });
}

/**
 * Dismiss a specific toast by ID, or all toasts if no ID provided.
 */
export function dismissToast(toastId?: string | number): void {
  if (toastId !== undefined) {
    sonnerToast.dismiss(toastId);
  } else {
    sonnerToast.dismiss();
  }
}

/**
 * Update an existing loading toast to success.
 */
export function updateToastToSuccess(
  toastId: string | number,
  title: string,
  options?: {
    description?: string;
  },
): void {
  sonnerToast.success(title, {
    id: toastId,
    description: options?.description,
  });
}

/**
 * Update an existing loading toast to error.
 */
export function updateToastToError(
  toastId: string | number,
  title: string,
  options?: {
    description?: string;
  },
): void {
  sonnerToast.error(title, {
    id: toastId,
    description: options?.description,
  });
}

// Re-export the raw toast for advanced use cases
export { sonnerToast as toast };
