import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldShellProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Consistent label + hint + error wrapper used by every registration field.
 * Errors are announced with aria-live so screen readers pick them up after a
 * validation attempt.
 */
export const FieldShell: React.FC<FieldShellProps> = ({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  className = '',
  children,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-1">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 text-sm font-bold text-[#191c1e]"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[#ba1a1a]" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {hint && (
          <span className="text-xs text-[#737686] font-medium">{hint}</span>
        )}
      </div>

      {children}

      <div aria-live="polite">
        {error && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#ba1a1a]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
};
