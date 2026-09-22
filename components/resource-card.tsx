import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Image as ImageIcon } from "lucide-react";

export type ResourceDTO = {
  id: string;
  name: string;
  type: string;
  building: string;
  capacity: number;
};

export function ResourceCard({
  resource,
}: {
  resource: ResourceDTO;
}) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
      {/* Image Placeholder Block */}
      <div className="h-40 w-full bg-muted flex items-center justify-center relative">
        <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
        <Badge className="absolute right-3 top-3 bg-background/80 backdrop-blur-sm" variant="outline">
          {resource.type.replace("_", " ")}
        </Badge>
      </div>
      
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-1">{resource.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {resource.building}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3 flex-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Up to {resource.capacity} people
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Link href={`/resource/${resource.id}#booking`} className="w-full">
            <Button size="sm" className="w-full">
              Book this
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
