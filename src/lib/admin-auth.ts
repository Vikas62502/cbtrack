import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "cb_admin";

function tokenFor(password: string) {
  const secret = process.env.ADMIN_PASSWORD || "changeme";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function expectedAdminToken() {
  return tokenFor(process.env.ADMIN_PASSWORD || "changeme");
}

export async function isAdmin() {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  const expected = expectedAdminToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export { COOKIE as ADMIN_COOKIE };
