# Production frontend: nginx serving React static build.
# The API base URL (VITE_API_URL) points DIRECTLY at the Laravel backend,
# so the browser calls the backend like Postman (CORS allows all origins) —
# this avoids fragile nginx proxying through the platform edge.
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=https://solution-api-production.up.railway.app/api
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve with Nginx (static SPA only)
FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.spa.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV PORT=80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
