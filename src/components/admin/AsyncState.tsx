import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, Loader2, RotateCw } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'جاري التحميل...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
      <p className="text-sm font-semibold text-primary">{label}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-error" />
      <p className="max-w-md text-sm font-semibold text-error">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-error-container px-4 py-2 text-xs font-bold text-on-error-container transition-colors hover:opacity-90"
        >
          <RotateCw className="h-3.5 w-3.5" />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title = 'لا توجد بيانات',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <Inbox className="h-8 w-8 text-outline" />
      <p className="text-sm font-bold text-on-surface">{title}</p>
      {description && (
        <p className="max-w-md text-xs leading-relaxed text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
