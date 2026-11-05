import { useEffect } from 'react';
import { analytics } from '../../lib/analytics';
import { listenForForegroundMessages } from '../../lib/notifications';

/**
 * Shows a browser notification when an FCM message arrives while the app is
 * open. Background messages are displayed by the service worker instead.
 */
export function NotificationListener(): null {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void listenForForegroundMessages((payload) => {
      const title = payload.notification?.title ?? 'إشعار جديد';
      const body = payload.notification?.body ?? '';
      const data = payload.data ?? {};

      analytics.event('push_notification_received', {
        type: data.type ?? 'unknown',
      });

      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return;
      }

      try {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          data,
        });

        notification.onclick = () => {
          window.focus();

          if (typeof data.url === 'string' && data.url) {
            window.location.href = data.url;
          }

          notification.close();
        };
      } catch (error) {
        console.warn('[firebase] Failed to show a foreground notification.', error);
      }
    }).then((stop) => {
      if (cancelled) {
        stop();
      } else {
        unsubscribe = stop;
      }
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return null;
}
