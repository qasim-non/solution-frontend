import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const pageWindow = (current: number, last: number): number[] => {
  if (last <= 5) {
    return Array.from({ length: last }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(current - 2, last - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
};

export function Pagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (lastPage <= 1) {
    return (
      <div className="border-t border-outline-variant/40 px-5 py-3 text-center text-xs text-on-surface-variant">
        {total > 0 ? `${total} عنصر` : 'لا توجد نتائج'}
      </div>
    );
  }

  const firstItem = (currentPage - 1) * perPage + 1;
  const lastItem = Math.min(currentPage * perPage, total);

  return (
    <div className="flex flex-col gap-3 border-t border-outline-variant/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-on-surface-variant">
        عرض {firstItem}–{lastItem} من {total} · صفحة {currentPage} من {lastPage}
      </p>
      <nav className="flex items-center gap-1" aria-label="صفحات النتائج">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/60 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pageWindow(currentPage, lastPage).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors disabled:opacity-40 ${
              page === currentPage
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage || isLoading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/60 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
