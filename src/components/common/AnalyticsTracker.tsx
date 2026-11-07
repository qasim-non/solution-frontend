import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../../lib/analytics';

/**
 * Firebase Analytics records the initial page view automatically. This
 * component records subsequent client-side route changes without duplicating
 * the first one.
 */
export function AnalyticsTracker(): null {
  const location = useLocation();
  const lastPath = useRef(`${location.pathname}${location.search}`);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;

    if (lastPath.current === path) {
      return;
    }

    lastPath.current = path;
    analytics.pageView(path);
  }, [location.pathname, location.search]);

  return null;
}
