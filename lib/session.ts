import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Deliberately simple mock session for the assignment's time budget:
// the cookie stores a userId directly. In a real app this would be a
// signed JWT / database session token, validated the same way in
// middleware.ts (edge-safe) and here (Node runtime, for Server Actions).
const SESSION_COOKIE = "spacebook_session";

export async function getSession() {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const userId = raw.split(".")[0];
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export function sessionCookieName() {
  return SESSION_COOKIE;
}
