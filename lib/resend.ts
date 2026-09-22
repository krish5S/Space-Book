import { Resend } from "resend";
import BookingConfirmation from "@/emails/booking-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(params: {
  to: string;
  userName: string;
  resourceName: string;
  startTime: Date;
  endTime: Date;
  status: string;
}) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "SpaceBook <onboarding@resend.dev>",
      to: params.to,
      subject: `SpaceBook: booking ${params.status.toLowerCase()} — ${params.resourceName}`,
      react: BookingConfirmation({
        userName: params.userName,
        resourceName: params.resourceName,
        startTime: params.startTime,
        endTime: params.endTime,
        status: params.status,
      }),
    });
  } catch (err) {
    // Never let a failed email break the booking flow — log and move on.
    console.error("Resend email failed:", err);
  }
}
