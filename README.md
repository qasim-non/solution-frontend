<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6af1166f-d764-4316-9e6a-bf961f1eeffc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase (Analytics + Web Push)

Copy the Firebase values into `.env.development` / `.env.production`:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Required for push. Firebase Console -> Project settings -> Cloud Messaging
# -> Web Push certificates.
VITE_FIREBASE_VAPID_KEY=
```

These are public values (they ship to the browser). Only the VAPID key is
required for notifications; Analytics works without it. Because Vite inlines
`VITE_*` variables at build time, rebuild after changing them (`npm run build`).

See `../backend/FIREBASE_SETUP.md` for the complete backend + frontend guide.
