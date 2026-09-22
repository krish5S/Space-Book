"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/ui-store";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BookingCart } from "@/components/booking-cart";

export function GlobalSheets({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { isCartOpen, setCartOpen } = useUIStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) return null;

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <BookingCart isLoggedIn={isLoggedIn} />
      </SheetContent>
    </Sheet>
  );
}
