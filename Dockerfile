# Production frontend: nginx serving React static build.
# The API base URL (VITE_API_URL) points DIRECTLY at the Laravel backend,
# so the browser calls the backend like Postman (CORS allows all origins) —
# this avoids fragile nginx proxying through the platform edge.
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=https://solution-api-production.up.railway.app/api
ARG VITE_FIREBASE_API_KEY=
ARG VITE_FIREBASE_AUTH_DOMAIN=
ARG VITE_FIREBASE_PROJECT_ID=
ARG VITE_FIREBASE_STORAGE_BUCKET=
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=
ARG VITE_FIREBASE_APP_ID=
ARG VITE_FIREBASE_MEASUREMENT_ID=
ARG VITE_FIREBASE_VAPID_KEY=
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_FIREBASE_VAPID_KEY=$VITE_FIREBASE_VAPID_KEY
RUN npm run build

# Stage 2: Serve with Nginx (static SPA only)
FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.spa.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV PORT=80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
