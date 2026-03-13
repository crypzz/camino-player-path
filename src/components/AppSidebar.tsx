import { 
  LayoutDashboard, Users, ClipboardList, Video, Target, CalendarCheck, 
  User, TrendingUp, Shield, ChevronDown
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAppContext } from '@/context/AppContext';
import { UserRole } from '@/types/player';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const coachLinks = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Players', url: '/players', icon: Users },
  { title: 'Evaluations', url: '/evaluations', icon: ClipboardList },
  { title: 'Attendance', url: '/attendance', icon: CalendarCheck },
];

const playerLinks = [
  { title: 'My Profile', url: '/', icon: User },
  { title: 'My Progress', url: '/progress', icon: TrendingUp },
  { title: 'Goals', url: '/goals', icon: Target },
];

const parentLinks = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Progress Reports', url: '/reports', icon: ClipboardList },
];

const roleLabels: Record<UserRole, string> = {
  coach: 'Coach',
  player: 'Player',
  parent: 'Parent',
};

const roleIcons: Record<UserRole, typeof Shield> = {
  coach: Shield,
  player: User,
  parent: Users,
};

export function AppSidebar() {
  const { role, setRole } = useAppContext();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const links = role === 'coach' ? coachLinks : role === 'player' ? playerLinks : parentLinks;
  const RoleIcon = roleIcons[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-6">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">C</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-foreground text-lg leading-none">Camino</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Player Development</p>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <span className="font-display font-bold text-primary-foreground text-sm">C</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      activeClassName="bg-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground">
              <RoleIcon className="h-4 w-4 text-primary" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{roleLabels[role]}</span>
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            {(['coach', 'player', 'parent'] as UserRole[]).map((r) => {
              const Icon = roleIcons[r];
              return (
                <DropdownMenuItem key={r} onClick={() => setRole(r)} className={r === role ? 'bg-accent' : ''}>
                  <Icon className="h-4 w-4 mr-2" />
                  {roleLabels[r]} View
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
