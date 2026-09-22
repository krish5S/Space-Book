import { z } from "zod";

// Shared schema: used for client-side inline validation (react-hook-form)
// AND re-validated inside the Server Action before it ever touches Prisma.
export const bookingSchema = z
  .object({
    resourceId: z.string().min(1, "Pick a resource"),
    date: z.string().min(1, "Pick a date"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Pick a start time"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Pick an end time"),
    purpose: z
      .string()
      .min(5, "Tell us a bit more (min 5 characters)")
      .max(200, "Keep it under 200 characters"),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.date}T${data.startTime}`);
      const end = new Date(`${data.date}T${data.endTime}`);
      return end > start;
    },
    { message: "End time must be after start time", path: ["endTime"] }
  )
  .refine(
    (data) => {
      const start = new Date(`${data.date}T${data.startTime}`);
      return start.getTime() > Date.now();
    },
    { message: "Booking must be in the future", path: ["date"] }
  );

export type BookingInput = z.infer<typeof bookingSchema>;
