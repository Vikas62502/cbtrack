#!/bin/sh
set -eu

mkdir -p /app/data

if [ -z "${DATABASE_URL:-}" ] && [ -n "${DB_HOST:-}" ]; then
  export DATABASE_URL="$(node -e "
    const host = process.env.DB_HOST;
    const name = process.env.DB_NAME;
    const user = encodeURIComponent(process.env.DB_USER || '');
    const password = encodeURIComponent(process.env.DB_PASSWORD || '');
    const port = process.env.DB_PORT || '5432';
    const local = host === 'localhost' || host === '127.0.0.1';
    const params = new URLSearchParams();
    if (!local) params.set('sslmode', 'require');
    process.stdout.write('postgresql://' + user + ':' + password + '@' + host + ':' + port + '/' + encodeURIComponent(name) + '?' + params.toString());
  ")"
fi

node /opt/prisma-cli/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma

export HOSTNAME=0.0.0.0
exec node /app/server.js
