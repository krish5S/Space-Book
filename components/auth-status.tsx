"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AuthStatus({ user }: { user: { name: string; role: string } | null }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">You're browsing as a guest.</p>
          <Link href="/login">
            <Button size="sm">Log in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="text-sm">
          Logged in as <strong>{user.name}</strong> <Badge variant="outline">{user.role}</Badge>
        </div>
        <Button size="sm" variant="ghost" onClick={logout}>
          Log out
        </Button>
      </CardContent>
    </Card>
  );
}
