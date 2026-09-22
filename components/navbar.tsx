"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useUIStore } from "@/lib/ui-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Home, Filter, ShoppingBag, ShieldCheck, User, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Navbar({
  currentUser,
}: {
  currentUser: { name: string; role: string } | null;
}) {
  const slotCount = useCartStore((s) => s.slots.length);
  const { setCartOpen, isFilterOpen, setFilterOpen } = useUIStore();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const RailIcon = ({ 
    icon: Icon, 
    label, 
    onClick, 
    href, 
    badge,
    isActive
  }: { 
    icon: any, 
    label: string, 
    onClick?: () => void, 
    href?: string, 
    badge?: number,
    isActive?: boolean
  }) => {
    const content = (
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        size="icon" 
        className="relative h-10 w-10 rounded-xl"
        onClick={onClick}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
        {!!badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {badge}
          </span>
        )}
      </Button>
    );

    const wrapped = href ? <Link href={href}>{content}</Link> : content;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{wrapped}</TooltipTrigger>
          <TooltipContent side="right" className="font-semibold">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const navItems = (
    <>
      <div className="flex flex-col items-center gap-4">
        <RailIcon icon={Home} label="Home" href="/" />
        <RailIcon 
          icon={Filter} 
          label="Filter" 
          onClick={() => setFilterOpen(!isFilterOpen)} 
          isActive={isFilterOpen}
        />
        <RailIcon 
          icon={ShoppingBag} 
          label="Cart" 
          onClick={() => setCartOpen(true)} 
          badge={slotCount} 
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        {currentUser?.role === "ADMIN" && (
          <RailIcon icon={ShieldCheck} label="Admin Panel" href="/admin" />
        )}
        {currentUser ? (
          <RailIcon icon={LogOut} label={`Log out (${currentUser.name})`} onClick={logout} />
        ) : (
          <RailIcon icon={User} label="Log in" href="/login" />
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Rail */}
      <aside className="hidden md:flex flex-col items-center justify-between border-r border-border bg-card w-16 py-6 shrink-0 h-screen">
        {navItems}
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur w-full">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold flex items-center gap-2">
            <Home className="h-5 w-5" />
            SpaceBook
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative">
              <ShoppingBag className="h-5 w-5" />
              {slotCount > 0 && (
                <span className="absolute 1 top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
                  {slotCount}
                </span>
              )}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Home</span>
                    <Link href="/"><Button variant="outline" size="sm">Go</Button></Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Filter</span>
                    <Button variant={isFilterOpen ? "default" : "outline"} size="sm" onClick={() => setFilterOpen(!isFilterOpen)}>
                      Toggle
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="h-px bg-border my-2" />
                  {currentUser?.role === "ADMIN" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Admin Panel</span>
                      <Link href="/admin"><Button variant="outline" size="sm">Admin</Button></Link>
                    </div>
                  )}
                  {currentUser ? (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Account</span>
                        <span className="text-xs text-muted-foreground">{currentUser.name}</span>
                      </div>
                      <Button variant="destructive" size="sm" onClick={logout}>Log out</Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Account</span>
                      <Link href="/login"><Button size="sm">Log in</Button></Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
