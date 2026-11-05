/*
 * Firebase Cloud Messaging service worker.
 *
 * The Firebase web config is public, so the app passes it in the script URL
 * when registering this worker. This keeps the worker static (no build step)
 * while still letting each environment use its own Firebase project.
 *
 * Background notifications with a `notification` payload are displayed by the
 * Firebase SDK. The backend also sets webpush.fcm_options.link so clicking the
 * notification opens the relevant page.
 */

importScripts('https://www.gstatic.com/firebasejs/13.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.2.0/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);

const firebaseConfig = {
  apiKey: params.get('apiKey') || undefined,
  authDomain: params.get('authDomain') || undefined,
  projectId: params.get('projectId') || undefined,
  storageBucket: params.get('storageBucket') || undefined,
  messagingSenderId: params.get('messagingSenderId') || undefined,
  appId: params.get('appId') || undefined,
  measurementId: params.get('measurementId') || undefined,
};

if (
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
) {
  firebase.initializeApp(firebaseConfig);

  // Registering the messaging instance installs the background push handler.
  firebase.messaging();
}
