import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAppContext } from '@/context/AppContext';

const roleGreetings: Record<string, string> = {
  coach: 'Coach Dashboard',
  player: 'Player Dashboard',
  parent: 'Parent Dashboard',
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAppContext();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b border-border px-4 shrink-0">
            <SidebarTrigger />
            <h2 className="font-display font-semibold text-foreground">{roleGreetings[role]}</h2>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
