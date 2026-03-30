"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Send,
  Fish,
  ChevronRight,
  Bolt,
  Bell,
  Search,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Kasir", url: "/pos", icon: ShoppingCart, hasActivity: true },
  { title: "Dapur", url: "/kitchen", icon: ChefHat },
  { title: "Daftar Menu", url: "/daftar-menu", icon: Send },
  { title: "Pengaturan", url: "/pengaturan", icon: Bolt },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      {/* HEADER */}
      <SidebarHeader className="h-[60px] border-b border-slate-200 flex items-center py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow">
            <Fish className="size-[18px]" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="font-bold text-[17px] tracking-tight text-slate-900 leading-none">
              SeaPOS
            </p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mt-0.5">
              Restoran Seafood
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2.5 py-4 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.9px] text-slate-400 font-semibold px-3 mb-2">
            Menu Utama
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                          isActive
                            ? "bg-orange-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-4 flex-shrink-0",
                            isActive ? "opacity-100" : "opacity-60",
                          )}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>

                        {item.hasActivity && !isActive && (
                          <span className="ml-auto size-1.5 rounded-full bg-orange-500 group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-slate-200 px-2.5 py-3 bg-white">
        <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] hover:bg-slate-100 transition-all duration-150 group">
          <div className="size-[30px] rounded-lg bg-emerald-100 flex items-center justify-center text-[11px] font-semibold text-emerald-600 flex-shrink-0">
            AK
          </div>

          <div className="text-left flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-[12.5px] font-semibold text-slate-800 truncate leading-none">
              Admin Kasir
            </p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">
              Kasir · Shift Pagi
            </p>
          </div>

          <ChevronRight className="size-3.5 text-slate-400 opacity-50 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
