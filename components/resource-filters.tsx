"use client";

import { useEffect, useState } from "react";
import { useFilterStore } from "@/lib/filter-store";
import { useUIStore } from "@/lib/ui-store";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

const TYPES = ["all", "STUDY_ROOM", "AV_EQUIPMENT", "SPORTS_COURT", "COMMON_ROOM"];

export function ResourceFilters({ buildings }: { buildings: string[] }) {
  const { building, type, setBuilding, setType, reset } = useFilterStore();
  const { isFilterOpen, setFilterOpen } = useUIStore();
  
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Hydration guard
  }

  const activeCount = (building !== "all" ? 1 : 0) + (type !== "all" ? 1 : 0);

  const filterControls = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Location</label>
        <Select value={building} onChange={(e) => setBuilding(e.target.value)}>
          <option value="all">All buildings</option>
          {buildings.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Resource Type</label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All types" : t.replace("_", " ")}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );

  if (isDesktop) {
    if (!isFilterOpen) return null;
    
    return (
      <aside className="w-64 shrink-0 border-r border-border bg-card overflow-y-auto h-screen">
        <div className="p-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </h2>
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={reset} className="text-xs h-8 px-2">
                Reset
              </Button>
            )}
          </div>
          <div className="h-px bg-border -mx-4" />
          {filterControls}
        </div>
      </aside>
    );
  }

  // Mobile uses the Sheet (controlled by UI store)
  return (
    <Sheet open={isFilterOpen} onOpenChange={setFilterOpen}>
      <SheetContent side="bottom" className="rounded-t-xl h-[50vh]">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filter
          </SheetTitle>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
              Reset
            </Button>
          )}
        </SheetHeader>
        {filterControls}
      </SheetContent>
    </Sheet>
  );
}
