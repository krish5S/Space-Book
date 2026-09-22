"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/validations/booking";
import { useCartStore } from "@/lib/cart-store";
import { useUIStore } from "@/lib/ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BookingForm({
  resourceId,
  resourceName,
  onClose,
}: {
  resourceId: string;
  resourceName: string;
  onClose?: () => void;
}) {
  const addSlot = useCartStore((s) => s.addSlot);
  const { setCartOpen } = useUIStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { resourceId, date: "", startTime: "", endTime: "", purpose: "" },
  });

  function onSubmit(data: BookingInput) {
    addSlot({
      id: crypto.randomUUID(),
      resourceId: data.resourceId,
      resourceName,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
    });
    reset({ resourceId, date: "", startTime: "", endTime: "", purpose: "" });
    if (onClose) onClose();
    setCartOpen(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <input type="hidden" {...register("resourceId")} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register("date")} className={errors.date ? "border-destructive" : ""} />
          {errors.date && <p className="text-[10px] text-destructive">{errors.date.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="startTime">Start</Label>
            <Input id="startTime" type="time" {...register("startTime")} className={errors.startTime ? "border-destructive" : ""} />
            {errors.startTime && <p className="text-[10px] text-destructive">{errors.startTime.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endTime">End</Label>
            <Input id="endTime" type="time" {...register("endTime")} className={errors.endTime ? "border-destructive" : ""} />
            {errors.endTime && <p className="text-[10px] text-destructive">{errors.endTime.message}</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Input id="purpose" placeholder="e.g. Group project meeting" {...register("purpose")} className={errors.purpose ? "border-destructive" : ""} />
        {errors.purpose && <p className="text-[10px] text-destructive">{errors.purpose.message}</p>}
      </div>

      <Button type="submit" className="mt-2 w-full">Add to cart</Button>
    </form>
  );
}
