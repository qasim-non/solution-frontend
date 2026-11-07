import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
  type EventParams,
} from 'firebase/analytics';

/**
 * Firebase web configuration.
 *
 * These values are public by design (they are shipped to the browser). They
 * are still read from Vite env vars so each environment can point at its own
 * Firebase project without editing source code.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
);

let firebaseApp: FirebaseApp | null = null;

/**
 * Return the singleton Firebase app, or null when env vars are missing.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    return null;
  }

  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  return firebaseApp;
}

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Analytics is unavailable in some browsers (e.g. no cookies / old browsers),
 * so every failure is treated as "not available" instead of breaking the app.
 */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!isFirebaseConfigured || typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      try {
        if (!(await isSupported())) {
          return null;
        }

        const app = getFirebaseApp();

        return app ? getAnalytics(app) : null;
      } catch (error) {
        console.warn('[firebase] Analytics is unavailable.', error);
        return null;
      }
    })();
  }

  return analyticsPromise;
}

/**
 * Log a Firebase Analytics event. Safe to call even when Firebase is not
 * configured yet.
 */
export async function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<void> {
  const analytics = await getFirebaseAnalytics();

  if (!analytics) {
    return;
  }

  try {
    logEvent(analytics, name, (params ?? {}) as EventParams);
  } catch (error) {
    console.warn('[firebase] Failed to log analytics event.', error);
  }
}
