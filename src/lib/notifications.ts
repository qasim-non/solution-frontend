import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from 'firebase/messaging';
import { apiClient } from '../api/client';
import { getFirebaseApp, isFirebaseConfigured } from './firebase';

const DEVICE_ID_KEY = 'tamkkun_device_id';
const FCM_TOKEN_KEY = 'tamkkun_fcm_token';
const SW_ACTIVATION_TIMEOUT_MS = 10_000;

/**
 * Stable id for this browser. It lets the backend link an anonymous customer
 * request to the push token that should receive the "request completed" event.
 */
export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

export function getVapidKey(): string | null {
  const key = import.meta.env.VITE_FIREBASE_VAPID_KEY?.trim();

  return key ? key : null;
}

/**
 * True when Firebase is configured and a VAPID key was provided.
 */
export function isPushConfigured(): boolean {
  return isFirebaseConfigured && Boolean(getVapidKey());
}

/**
 * True when the current browser can receive web push notifications.
 */
export function isPushSupported(): boolean {
  return (
    isPushConfigured() &&
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator
  );
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission;
}

export function hasStoredToken(): boolean {
  return Boolean(localStorage.getItem(FCM_TOKEN_KEY));
}

async function getMessagingInstance(): Promise<Messaging | null> {
  if (!isFirebaseConfigured) {
    return null;
  }

  const app = getFirebaseApp();

  if (!app || !(await isSupported())) {
    return null;
  }

  return getMessaging(app);
}

/**
 * Resolve once the registration has an active worker.
 *
 * `register()` resolves as soon as the worker starts installing. Calling
 * PushManager.subscribe() before the worker is active throws
 * "Subscription failed - no active Service Worker", so wait for the
 * `activated` state and surface a readable error on failure.
 */
function waitForServiceWorkerActivation(
  registration: ServiceWorkerRegistration
): Promise<void> {
  const pendingWorker = registration.installing ?? registration.waiting;

  if (!pendingWorker) {
    if (registration.active) {
      return Promise.resolve();
    }

    return navigator.serviceWorker.ready.then(() => undefined);
  }

  return new Promise((resolve, reject) => {
    let timeout: number;

    const fail = () => {
      window.clearTimeout(timeout);
      pendingWorker.removeEventListener('statechange', onStateChange);
      reject(
        new Error('تعذر تفعيل خدمة الإشعارات. أعد تحميل الصفحة وحاول مرة أخرى.')
      );
    };

    function onStateChange() {
      if (pendingWorker.state === 'activated') {
        window.clearTimeout(timeout);
        pendingWorker.removeEventListener('statechange', onStateChange);
        resolve();
      } else if (pendingWorker.state === 'redundant') {
        fail();
      }
    }

    timeout = window.setTimeout(fail, SW_ACTIVATION_TIMEOUT_MS);
    pendingWorker.addEventListener('statechange', onStateChange);
    onStateChange();
  });
}

/**
 * The service worker needs the Firebase config to initialize in the
 * background. The config is public, so passing it in the script URL is safe
 * and avoids a build-time code generation step.
 */
async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  const params = new URLSearchParams();
  const config: Record<string, string | undefined> = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  Object.entries(config).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const registration = await navigator.serviceWorker.register(
    `/firebase-messaging-sw.js?${params.toString()}`,
    { scope: '/', updateViaCache: 'none' }
  );

  await waitForServiceWorkerActivation(registration);

  return registration;
}

/**
 * Ask the user for permission, obtain an FCM token and register it with the
 * backend. Must be triggered by an explicit user action (never on page load).
 */
export async function registerPushNotifications(): Promise<string> {
  if (!isPushConfigured()) {
    throw new Error('إشعارات الدفع غير مهيأة على هذا الموقع.');
  }

  if (!isPushSupported()) {
    throw new Error('هذا المتصفح لا يدعم إشعارات الدفع.');
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('تم رفض إذن الإشعارات. يمكنك تفعيله من إعدادات المتصفح.');
  }

  const messaging = await getMessagingInstance();

  if (!messaging) {
    throw new Error('تعذر تهيئة إشعارات الدفع في هذا المتصفح.');
  }

  const token = await getToken(messaging, {
    vapidKey: getVapidKey() ?? undefined,
    serviceWorkerRegistration: await getServiceWorkerRegistration(),
  });

  await apiClient.post('/device-tokens', {
    token,
    device_id: getDeviceId(),
    platform: 'web',
  });

  localStorage.setItem(FCM_TOKEN_KEY, token);

  return token;
}

/**
 * Remove the token from the backend and from Firebase.
 */
export async function unregisterPushNotifications(): Promise<void> {
  const token = localStorage.getItem(FCM_TOKEN_KEY);

  if (token) {
    try {
      await apiClient.delete('/device-tokens', { data: { token } });
    } catch (error) {
      console.warn('[firebase] Failed to remove the device token from the API.', error);
    }
  }

  try {
    const messaging = await getMessagingInstance();

    if (messaging) {
      await deleteToken(messaging);
    }
  } catch (error) {
    console.warn('[firebase] Failed to delete the FCM token.', error);
  }

  localStorage.removeItem(FCM_TOKEN_KEY);
}

/**
 * Listen for messages received while the app is in the foreground.
 * Returns an unsubscribe function.
 */
export async function listenForForegroundMessages(
  handler: (payload: MessagePayload) => void
): Promise<() => void> {
  if (!isFirebaseConfigured) {
    return () => undefined;
  }

  const messaging = await getMessagingInstance();

  if (!messaging) {
    return () => undefined;
  }

  return onMessage(messaging, handler);
}
