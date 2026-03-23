"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  ChefHat,
  ShoppingCart,
  Settings,
  Fish,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Kasir (POS)", href: "/pos", icon: ShoppingCart },
  { name: "Dapur (Kitchen)", href: "/kitchen", icon: ChefHat },
  { name: "Daftar Menu", href: "/daftar-menu", icon: Utensils },
];

const NavContent = ({ pathname }: { pathname: string }) => (
  <div className="flex flex-col h-full bg-zinc-950 text-zinc-300">
    <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
      <div className="bg-orange-600 p-2 rounded-lg text-white">
        <Fish className="w-6 h-6" />
      </div>
      <span className="font-black text-xl tracking-tighter text-white uppercase">
        Sea-POS
      </span>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
              isActive
                ? "bg-orange-600/10 text-orange-500 border border-orange-600/20"
                : "hover:bg-zinc-900 hover:text-white",
            )}
          >
            <item.icon
              className={cn(
                "w-5 h-5",
                isActive ? "text-orange-500" : "text-zinc-500",
              )}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  </div>
);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* DESKTOP SIDEBAR (Muncul hanya di layar besar 'lg') */}
      <aside className="hidden lg:flex w-64 border-r border-zinc-800 h-screen sticky top-0">
        <NavContent pathname={pathname} />
      </aside>

      {/* MOBILE NAVIGATION (Muncul di layar kecil) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-md"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-64 bg-zinc-950 border-zinc-800"
          >
            <NavContent pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
