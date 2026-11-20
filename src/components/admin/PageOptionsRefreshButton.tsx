import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useInvalidatePageOptions } from '../../hooks/usePageOptions';

interface PageOptionsRefreshButtonProps {
  label?: string;
}

export function PageOptionsRefreshButton({
  label = 'تحديث الخيارات',
}: PageOptionsRefreshButtonProps) {
  const invalidate = useInvalidatePageOptions();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    setIsRefreshing(true);
    try {
      await invalidate();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isRefreshing}
      className="inline-flex items-center gap-2 rounded-full border border-outline-variant/70 bg-surface-container-lowest px-3.5 py-2 text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60"
    >
      <RefreshCw
        className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
      />
      {isRefreshing ? 'جاري التحديث...' : label}
    </button>
  );
}
