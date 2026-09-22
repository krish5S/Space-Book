"use client";

import { useState, useTransition, useEffect } from "react";
import { updateBookingStatus } from "@/app/actions/booking";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { useMediaQuery } from "@/hooks/use-media-query";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "destructive",
  CANCELLED: "outline",
};

type RowProps = {
  id: string;
  resourceName: string;
  userName: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: string;
};

function useBookingActions(props: RowProps) {
  const [status, setStatus] = useState(props.status);
  const [isPending, startTransition] = useTransition();

  function act(next: "APPROVED" | "REJECTED" | "CANCELLED") {
    startTransition(async () => {
      const res = await updateBookingStatus(props.id, next);
      if (res.ok) setStatus(next);
    });
  }

  return { status, isPending, act };
}

export function AdminBookingRowDesktop(props: RowProps) {
  const { status, isPending, act } = useBookingActions(props);
  
  // Manage tabIndex based on actual viewport so hidden buttons aren't keyboard-focusable
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const tabIndex = mounted && !isDesktop ? -1 : 0;
  const ariaHidden = mounted && !isDesktop ? true : undefined;

  return (
    <TableRow aria-hidden={ariaHidden}>
      <TableCell className="font-medium">{props.resourceName}</TableCell>
      <TableCell>{props.userName}</TableCell>
      <TableCell>
        <div className="text-xs">
          <div>{new Date(props.startTime).toLocaleDateString()}</div>
          <div className="text-muted-foreground">
            {new Date(props.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(props.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </TableCell>
      <TableCell className="max-w-[200px] truncate" title={props.purpose}>{props.purpose}</TableCell>
      <TableCell>
        <Badge variant={STATUS_VARIANT[status] ?? "outline"}>{status}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {status === "PENDING" && (
            <>
              <Button size="sm" disabled={isPending} onClick={() => act("APPROVED")} tabIndex={tabIndex}>
                Approve
              </Button>
              <Button size="sm" variant="destructive" disabled={isPending} onClick={() => act("REJECTED")} tabIndex={tabIndex}>
                Reject
              </Button>
            </>
          )}
          {status === "APPROVED" && (
            <Button size="sm" variant="outline" disabled={isPending} onClick={() => act("CANCELLED")} tabIndex={tabIndex}>
              Cancel
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AdminBookingRowMobile(props: RowProps) {
  const { status, isPending, act } = useBookingActions(props);
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const tabIndex = mounted && isDesktop ? -1 : 0;
  const ariaHidden = mounted && isDesktop ? true : undefined;

  return (
    <Card aria-hidden={ariaHidden}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium">
              {props.resourceName}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {props.userName}
            </div>
          </div>
          <Badge variant={STATUS_VARIANT[status] ?? "outline"}>{status}</Badge>
        </div>
        
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
          <div className="font-medium text-foreground mb-1">{props.purpose}</div>
          <div>
            {new Date(props.startTime).toLocaleString()} → {new Date(props.endTime).toLocaleTimeString()}
          </div>
        </div>
        
        <div className="flex gap-2 w-full pt-1">
          {status === "PENDING" && (
            <>
              <Button className="flex-1" size="sm" disabled={isPending} onClick={() => act("APPROVED")} tabIndex={tabIndex}>
                Approve
              </Button>
              <Button className="flex-1" size="sm" variant="destructive" disabled={isPending} onClick={() => act("REJECTED")} tabIndex={tabIndex}>
                Reject
              </Button>
            </>
          )}
          {status === "APPROVED" && (
            <Button className="flex-1" size="sm" variant="outline" disabled={isPending} onClick={() => act("CANCELLED")} tabIndex={tabIndex}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
