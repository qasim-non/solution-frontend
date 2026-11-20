import type { ReactNode } from 'react';

interface AdminCardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function AdminCard({
  title,
  subtitle,
  actions,
  children,
  className = '',
  bodyClassName = '',
}: AdminCardProps) {
  const hasHeader = Boolean(title || subtitle || actions);

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-sm ${className}`}
    >
      {hasHeader && (
        <header className="flex flex-col gap-3 border-b border-outline-variant/40 bg-surface-container-low/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-base font-bold text-on-surface">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-on-surface-variant">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </header>
      )}
      <div className={bodyClassName || 'p-5'}>{children}</div>
    </section>
  );
}
