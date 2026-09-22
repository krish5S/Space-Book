import { prisma } from "@/lib/prisma";
import { BookingSection } from "@/components/booking-section";

// Server Component: all data fetching happens here, on the server,
// with Prisma. Only plain serializable props (arrays of DTOs) cross
// into the client components below — this is the RSC/client hydration
// boundary the assignment asks you to document.
export default async function HomePage() {
  const resources = await prisma.resource.findMany({ orderBy: { name: "asc" } });
  const buildings = Array.from(new Set(resources.map((r) => r.building)));

  return <BookingSection resources={resources} buildings={buildings} />;
}
