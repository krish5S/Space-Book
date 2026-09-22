"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

// Cycles light -> dark -> system to avoid a layout-shifting dropdown.
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Reserve the same footprint before/after mount so there's no layout shift.
  if (!mounted) return <div className="h-9 w-9" />;

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(next)} aria-label="Toggle theme">
      <Icon className="h-4 w-4" />
    </Button>
  );
}
