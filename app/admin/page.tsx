import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminBookingRowDesktop, AdminBookingRowMobile } from "@/components/admin-booking-row";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Belt-and-suspenders: middleware.ts already blocks non-admins at the
// edge before this route resolves, but a Server Component page that
// does mutations should never rely on middleware alone — re-check here.
export default async function AdminPage() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") redirect("/");

  const [bookings, auditLogs] = await Promise.all([
    prisma.booking.findMany({
      include: { user: true, resource: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin — Bookings</h1>
        <p className="text-sm text-muted-foreground">Approve, reject, or cancel booking requests.</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <AdminBookingRowDesktop
                key={b.id}
                id={b.id}
                resourceName={b.resource.name}
                userName={b.user.name}
                startTime={b.startTime.toISOString()}
                endTime={b.endTime.toISOString()}
                purpose={b.purpose}
                status={b.status}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {bookings.map((b) => (
          <AdminBookingRowMobile
            key={b.id}
            id={b.id}
            resourceName={b.resource.name}
            userName={b.user.name}
            startTime={b.startTime.toISOString()}
            endTime={b.endTime.toISOString()}
            purpose={b.purpose}
            status={b.status}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit log</CardTitle>
          <CardDescription>Last 15 actions across the system.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex justify-between border-b border-border/50 py-1">
              <span>
                <strong>{log.user.name}</strong> — {log.action}
              </span>
              <span className="text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
