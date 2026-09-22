import { NextRequest, NextResponse } from "next/server";

// Edge-safe role gate. We can't hit Prisma from the edge runtime cheaply,
// so the session cookie carries the role alongside the userId
// (format: "<userId>.<role>") set once at login — this is the
// "proxy/middleware validates role-based access before requests resolve
// to backend route segments" requirement (CO3).
const SESSION_COOKIE = "spacebook_session";

export function middleware(req: NextRequest) {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const role = raw?.split(".")[1];

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin");

  if ((isAdminRoute || isAdminApi) && role !== "ADMIN") {
    if (isAdminApi) {
      return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/?denied=admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
