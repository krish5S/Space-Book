"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { createBooking } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { X, Loader2, CalendarClock } from "lucide-react";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function BookingCart({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { slots, removeSlot, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{ id: string; ok: boolean; message: string }[]>([]);

  async function confirmAll() {
    setSubmitting(true);
    setResults([]);
    const outcomes: typeof results = [];

    for (const slot of slots) {
      const res = await createBooking({
        resourceId: slot.resourceId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        purpose: slot.purpose,
      });
      outcomes.push({
        id: slot.id,
        ok: res.ok,
        message: res.ok ? "Booked — pending approval" : res.error,
      });
      if (res.ok) removeSlot(slot.id);
    }

    setResults(outcomes);
    setSubmitting(false);
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="pb-4 border-b border-border text-left">
        <SheetTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Booking Cart
        </SheetTitle>
        <SheetDescription>
          {slots.length === 0 ? "No slots staged yet." : `${slots.length} slot(s) ready to submit.`}
        </SheetDescription>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="grid gap-3">
          {slots.map((s) => (
            <div key={s.id} className="group flex items-start justify-between rounded-md border border-border p-3 text-sm transition-colors hover:bg-muted/50">
              <div className="space-y-1">
                <div className="font-medium leading-none">{s.resourceName}</div>
                <div className="text-xs text-muted-foreground">
                  {s.date} · {s.startTime}–{s.endTime}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  Purpose: {s.purpose}
                </div>
              </div>
              <button 
                onClick={() => removeSlot(s.id)} 
                aria-label="Remove slot"
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}

          {slots.length === 0 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
              <CalendarClock className="h-10 w-10 opacity-20 mb-3" />
              <p>Your cart is empty.</p>
              <p>Find a resource to book.</p>
            </div>
          )}

          {results.map((r) => (
            <div
              key={r.id}
              className={`rounded-md px-3 py-2 text-xs ${r.ok ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}
            >
              {r.message}
            </div>
          ))}
        </div>
      </div>
      
      {slots.length > 0 && (
        <div className="pt-4 border-t border-border mt-auto flex flex-col gap-2">
          <Button onClick={confirmAll} disabled={submitting || !isLoggedIn} className="w-full">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm all bookings
          </Button>
          <Button variant="outline" onClick={clearCart} disabled={submitting} className="w-full">
            Clear Cart
          </Button>
          {!isLoggedIn && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              <a href="/login" className="underline hover:text-primary transition-colors">
                Log in
              </a>{" "}
              to confirm.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
