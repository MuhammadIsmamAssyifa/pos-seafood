import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function PengaturanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 lg:hidden">
            <SidebarTrigger />
            <span className="font-bold">SEA-POS</span>
          </header>

          <div className="hidden lg:block p-2 absolute">
            <SidebarTrigger />
          </div>

          <div className="w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
