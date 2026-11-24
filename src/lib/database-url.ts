export function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const host = process.env.DB_HOST;
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  if (!host || !name || !user) return undefined;

  const port = process.env.DB_PORT || "5432";
  const password = encodeURIComponent(process.env.DB_PASSWORD || "");
  const local = host === "localhost" || host === "127.0.0.1";
  const params = new URLSearchParams();
  if (!local) params.set("sslmode", "require");
  const query = params.toString();

  return `postgresql://${encodeURIComponent(user)}:${password}@${host}:${port}/${encodeURIComponent(name)}${query ? `?${query}` : ""}`;
}

export function ensureDatabaseUrl() {
  const url = resolveDatabaseUrl();
  if (url) process.env.DATABASE_URL = url;
  return url;
}
