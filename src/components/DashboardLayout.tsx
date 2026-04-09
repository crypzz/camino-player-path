import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAppContext } from '@/context/AppContext';
import { NotificationBell } from '@/components/NotificationBell';

const roleGreetings: Record<string, string> = {
  coach: 'Coach Dashboard',
  player: 'Player Dashboard',
  parent: 'Parent Dashboard',
  director: 'Director Dashboard',
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAppContext();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-border/60 px-5 shrink-0 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="w-px h-5 bg-border" />
              <h2 className="font-display font-semibold text-foreground text-sm">{roleGreetings[role]}</h2>
            </div>
            <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Bell className="h-4 w-4" />
            </button>
          </header>
          <main className="flex-1 overflow-auto p-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
