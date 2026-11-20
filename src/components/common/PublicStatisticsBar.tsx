import { usePublicStatistics } from '../../hooks/usePageOptions';
import { Code2, Users } from 'lucide-react';

interface PublicStatisticsBarProps {
  className?: string;
}

const formatCount = (value: number): string =>
  `+${new Intl.NumberFormat('ar-EG').format(value)}`;

/**
 * The public API owns visibility through `do_show`. While the request is in
 * flight, or if it fails, nothing is rendered so no estimated or stale counts
 * are ever presented as real data.
 */
export function PublicStatisticsBar({ className = '' }: PublicStatisticsBarProps) {
  const statisticsQuery = usePublicStatistics();
  const statistics = statisticsQuery.data;

  if (!statistics || statistics.do_show !== true) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/90 p-6 shadow-sm backdrop-blur-xl sm:p-8 ${className}`}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:divide-x sm:divide-x-reverse sm:divide-surface-container">
        <div className="flex items-center justify-center gap-4 p-2">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Code2 className="h-7 w-7" />
          </span>
          <div className="flex flex-col text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
                {formatCount(statistics.completed_projects)}
              </span>
              <span className="rounded-full bg-tertiary-fixed px-2 py-0.5 text-[11px] font-bold text-tertiary-container">
                منجز
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-on-surface">
              مشروع برمجي منجز
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 p-2">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary-fixed/50 text-secondary">
            <Users className="h-7 w-7" />
          </span>
          <div className="flex flex-col text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
                {formatCount(statistics.approved_developers)}
              </span>
              <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[11px] font-bold text-primary">
                معتمد
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-on-surface">
              مطور معتمد في الشبكة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
