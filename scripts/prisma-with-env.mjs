import { spawn } from "child_process";
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!match) continue;
  let value = match[2].trim();
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1);
  }
  process.env[match[1]] = value;
}

const host = process.env.DB_HOST;
const name = process.env.DB_NAME;
const user = encodeURIComponent(process.env.DB_USER || "");
const password = encodeURIComponent(process.env.DB_PASSWORD || "");
const port = process.env.DB_PORT || "5432";
const local = host === "localhost" || host === "127.0.0.1";
const params = new URLSearchParams();
if (!local) params.set("sslmode", "require");
const query = params.toString();
process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${encodeURIComponent(name)}${query ? `?${query}` : ""}`;

const args = process.argv.slice(2);
const child = spawn("yarn", ["prisma", ...args], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 1));
