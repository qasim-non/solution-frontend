import { useEffect, useState } from 'react';
import { Bell, BellRing, Loader2 } from 'lucide-react';
import { analytics } from '../../lib/analytics';
import {
  getNotificationPermission,
  hasStoredToken,
  isPushConfigured,
  isPushSupported,
  registerPushNotifications,
  unregisterPushNotifications,
} from '../../lib/notifications';

type PushStatus =
  | 'loading'
  | 'enabled'
  | 'disabled'
  | 'unsupported'
  | 'unconfigured';

interface PushNotificationToggleProps {
  showLabel?: boolean;
  className?: string;
}

/**
 * Explicit opt-in button for web push notifications.
 *
 * Browsers require a user gesture before asking for permission, so this is a
 * button instead of an automatic prompt on page load.
 */
export function PushNotificationToggle({
  showLabel = false,
  className = '',
}: PushNotificationToggleProps) {
  const [status, setStatus] = useState<PushStatus>('loading');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushConfigured()) {
      setStatus('unconfigured');
      return;
    }

    if (!isPushSupported()) {
      setStatus('unsupported');
      return;
    }

    const permission = getNotificationPermission();
    setStatus(permission === 'granted' && hasStoredToken() ? 'enabled' : 'disabled');
  }, []);

  const handleClick = async () => {
    if (busy || status === 'loading') {
      return;
    }

    setError(null);
    setBusy(true);

    try {
      if (status === 'enabled') {
        await unregisterPushNotifications();
        setStatus('disabled');
      } else {
        await registerPushNotifications();
        setStatus('enabled');
        analytics.event('push_notifications_enabled');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذر تحديث إعدادات الإشعارات.');
    } finally {
      setBusy(false);
    }
  };

  const isUnavailable = status === 'unsupported' || status === 'unconfigured';
  const isEnabled = status === 'enabled';

  const label = (() => {
    switch (status) {
      case 'enabled':
        return 'الإشعارات مفعّلة';
      case 'unsupported':
        return 'الإشعارات غير مدعومة';
      case 'unconfigured':
        return 'الإشعارات غير مهيأة';
      default:
        return 'تفعيل الإشعارات';
    }
  })();

  const title =
    status === 'unconfigured'
      ? 'أضف VITE_FIREBASE_VAPID_KEY لتفعيل إشعارات الدفع.'
      : status === 'unsupported'
        ? 'هذا المتصفح لا يدعم إشعارات الدفع.'
        : label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || status === 'loading' || isUnavailable}
        title={title}
        aria-label={label}
        aria-pressed={isEnabled}
        className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
          showLabel ? 'w-full justify-start px-4 py-2.5' : 'p-2'
        } ${
          isEnabled
            ? 'bg-[#e8f0ff] text-[#004ac6]'
            : 'text-[#434655] hover:bg-[#eceef0]'
        } ${className}`}
      >
        {busy || status === 'loading' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isEnabled ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}

        {showLabel && <span>{label}</span>}
      </button>

      {error && (
        <span className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg bg-[#ffdad6] px-3 py-2 text-xs font-semibold leading-5 text-[#ba1a1a] shadow-lg">
          {error}
        </span>
      )}
    </div>
  );
}
