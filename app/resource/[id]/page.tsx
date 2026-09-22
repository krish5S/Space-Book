import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Image as ImageIcon } from "lucide-react";
import { BookingForm } from "@/components/booking-form";

export default async function ResourcePage({ params }: { params: { id: string } }) {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
  });

  if (!resource) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero Image Placeholder */}
      <div className="w-full h-64 md:h-96 bg-muted rounded-2xl flex items-center justify-center mb-8 relative">
        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Overview Header */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold">{resource.name}</h1>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {resource.type.replace("_", " ")}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{resource.building}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Up to {resource.capacity} people</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Description Section */}
          <section>
            <h2 className="text-xl font-semibold mb-3">About this space</h2>
            <p className="text-muted-foreground leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui
              mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque
              eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus
              molestie magna non est bibendum non venenatis nisl tempor. Suspendisse
              dictum feugiat nisl ut dapibus.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit
              odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue.
              Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu
              ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus.
            </p>
          </section>
        </div>

        {/* Booking Form Panel */}
        <div>
          <div id="booking" className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Reserve this resource</h2>
            <BookingForm resourceId={resource.id} resourceName={resource.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
