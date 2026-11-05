import { trackEvent } from './firebase';

type AnalyticsValue = string | number | boolean | undefined;

/**
 * Small facade over Firebase Analytics so components do not import the SDK
 * directly. Keeping the calls in one place makes it easy to add providers or
 * disable analytics later.
 */
export const analytics = {
  pageView(path: string, title?: string): void {
    void trackEvent('page_view', {
      page_path: path,
      page_title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
    });
  },

  event(name: string, params?: Record<string, AnalyticsValue>): void {
    void trackEvent(name, params);
  },
};
