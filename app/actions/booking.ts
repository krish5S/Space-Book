"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { bookingSchema, type BookingInput } from "@/lib/validations/booking";
import { sendBookingConfirmation } from "@/lib/resend";

export type BookingActionResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

export async function createBooking(input: BookingInput): Promise<BookingActionResult> {
  // 1. Re-validate with the SAME Zod schema the client form used.
  //    Never trust client-side validation alone for a mutation.
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  // 2. Auth check — Server Actions are just as exposed as API routes.
  const user = await getSession();
  if (!user) {
    return { ok: false, error: "You must be logged in to book a resource" };
  }

  const startTime = new Date(`${data.date}T${data.startTime}`);
  const endTime = new Date(`${data.date}T${data.endTime}`);

  // 3. Conflict check: no overlapping APPROVED/PENDING bookings on the same resource.
  const overlapping = await prisma.booking.findFirst({
    where: {
      resourceId: data.resourceId,
      status: { in: ["PENDING", "APPROVED"] },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });
  if (overlapping) {
    return { ok: false, error: "That slot overlaps with an existing booking" };
  }

  // 4. Mutation + audit log, then fire the transactional email.
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      resourceId: data.resourceId,
      startTime,
      endTime,
      purpose: data.purpose,
      status: "PENDING",
    },
    include: { resource: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "BOOKING_CREATED",
      meta: JSON.stringify({ bookingId: booking.id }),
    },
  });

  await sendBookingConfirmation({
    to: user.email,
    userName: user.name,
    resourceName: booking.resource.name,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: "PENDING",
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return { ok: true, bookingId: booking.id };
}

export async function updateBookingStatus(
  bookingId: string,
  status: "APPROVED" | "REJECTED" | "CANCELLED"
): Promise<BookingActionResult> {
  const admin = await getSession();
  if (!admin || admin.role !== "ADMIN") {
    return { ok: false, error: "Admin only" };
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { resource: true, user: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: `BOOKING_${status}`,
      meta: JSON.stringify({ bookingId }),
    },
  });

  await sendBookingConfirmation({
    to: booking.user.email,
    userName: booking.user.name,
    resourceName: booking.resource.name,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status,
  });

  revalidatePath("/admin");
  return { ok: true, bookingId };
}
