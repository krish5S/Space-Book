"use client";

import { useFilterStore } from "@/lib/filter-store";
import { ResourceFilters } from "@/components/resource-filters";
import { ResourceCard, type ResourceDTO } from "@/components/resource-card";

export function BookingSection({
  resources,
  buildings,
}: {
  resources: ResourceDTO[];
  buildings: string[];
}) {
  const { building, type } = useFilterStore();

  const filtered = resources.filter(
    (r) => (building === "all" || r.building === building) && (type === "all" || r.type === type)
  );

  return (
    <div className="flex h-full w-full">
      <ResourceFilters buildings={buildings} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resources</h1>
          <span className="text-sm text-muted-foreground">{filtered.length} found</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <p>No resources match these filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
