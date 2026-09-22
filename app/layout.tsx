import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { getSession } from "@/lib/session";
import { GlobalSheets } from "@/components/global-sheets";

export const metadata: Metadata = {
  title: "SpaceBook — Campus Resource Booking",
  description: "Book study rooms, AV equipment, courts and common rooms on campus.",
};

// This is a Server Component. getSession() runs on the server and only
// the plain-object result (name/role) crosses the RSC -> Client Component
// boundary into <Navbar>, not the DB client or any server-only code —
// that's the hydration-boundary / prop-serialization story for the report.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  const currentUser = user ? { name: user.name, role: user.role } : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <Navbar currentUser={currentUser} />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
          <GlobalSheets isLoggedIn={!!currentUser} />
        </ThemeProvider>
      </body>
    </html>
  );
}
