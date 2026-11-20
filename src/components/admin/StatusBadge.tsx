interface LabelAndTone {
  label: string;
  className: string;
}

const requestStatuses: Record<string, LabelAndTone> = {
  pending: {
    label: 'قيد الانتظار',
    className: 'bg-secondary-fixed/60 text-on-secondary-fixed-variant',
  },
  reviewed: {
    label: 'تمت المراجعة',
    className: 'bg-primary-fixed text-on-primary-fixed-variant',
  },
  completed: {
    label: 'مكتمل',
    className: 'bg-tertiary-fixed/50 text-on-tertiary-fixed-variant',
  },
};

const developerStatuses: Record<string, LabelAndTone> = {
  pending: {
    label: 'جديد',
    className: 'bg-secondary-fixed/60 text-on-secondary-fixed-variant',
  },
  under_review: {
    label: 'قيد المراجعة',
    className: 'bg-primary-fixed text-on-primary-fixed-variant',
  },
  shortlisted: {
    label: 'القائمة المختصرة',
    className: 'bg-primary-fixed/70 text-on-primary-fixed-variant',
  },
  approved: {
    label: 'معتمد',
    className: 'bg-tertiary-fixed/50 text-on-tertiary-fixed-variant',
  },
  rejected: {
    label: 'مرفوض',
    className: 'bg-error-container text-on-error-container',
  },
  suspended: {
    label: 'موقوف',
    className: 'bg-surface-container-highest text-on-surface-variant',
  },
};

const fallback: LabelAndTone = {
  label: '—',
  className: 'bg-surface-container text-on-surface-variant',
};

const Badge = ({ value }: { value: LabelAndTone }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${value.className}`}
  >
    {value.label}
  </span>
);

export const RequestStatusBadge = ({ status }: { status: string }) => (
  <Badge value={requestStatuses[status] ?? { ...fallback, label: status }} />
);

export const DeveloperStatusBadge = ({ status }: { status: string }) => (
  <Badge value={developerStatuses[status] ?? { ...fallback, label: status }} />
);

export const ReadinessBadge = ({ isReady }: { isReady: boolean }) =>
  isReady ? (
    <Badge
      value={{
        label: 'مستعد للعمل',
        className: 'bg-tertiary-fixed/50 text-on-tertiary-fixed-variant',
      }}
    />
  ) : (
    <Badge
      value={{
        label: 'غير مستعد حالياً',
        className: 'bg-surface-container-highest text-on-surface-variant',
      }}
    />
  );
