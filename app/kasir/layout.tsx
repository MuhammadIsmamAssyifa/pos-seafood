// app/kasir/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import MobileCartTrigger from "@/app/kasir/_components/MobileCartTrigger";

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {/* Header Mobile */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:hidden bg-white sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-bold text-[#c45c1a]">SEA-POS</span>
            </div>

            <MobileCartTrigger />
          </header>

          <div className="hidden lg:block p-2 absolute z-50">
            <SidebarTrigger />
          </div>

          <div className="w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
