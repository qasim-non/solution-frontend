#!/bin/sh
set -e

# Platform-provided port (Railway/Heroku set $PORT; default 80)
PORT="${PORT:-80}"

# Backend proxy target. Required. No trailing slash.
BACKEND_URL="${BACKEND_URL:-http://localhost:80}"

# Render the nginx config with our placeholders substituted (sed, not envsubst).
sed -e "s|__PORT__|${PORT}|g" \
    -e "s|__BACKEND_URL__|${BACKEND_URL}|g" \
    /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf

echo "Nginx on port ${PORT}, backend ${BACKEND_URL}"

exec nginx -g "daemon off;"
