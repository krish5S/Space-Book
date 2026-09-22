"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

// Wraps next-themes. suppressHydrationWarning on <html> in layout.tsx +
// this provider is what prevents the CO1 "hydration mismatch" warning
// you'd otherwise get from the theme class being applied client-side only.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
