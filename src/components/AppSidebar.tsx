import caminoLogo from '@/assets/camino-logo.png';
import { 
  LayoutDashboard, Users, ClipboardList, Video, Target, CalendarCheck, 
  User, TrendingUp, Shield, ChevronDown, FileText, LogOut, Trophy, Newspaper, Activity, Building2, Star
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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

const sharedLinks = [
  { title: 'Leaderboard', url: '/dashboard/leaderboard', icon: Trophy },
  { title: 'Feed', url: '/dashboard/feed', icon: Newspaper },
];

const coachLinks = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Players', url: '/dashboard/players', icon: Users },
  { title: 'Evaluations', url: '/dashboard/evaluations', icon: ClipboardList },
  { title: 'Video Analysis', url: '/dashboard/videos', icon: Video },
  { title: 'Reports', url: '/dashboard/reports', icon: FileText },
  { title: 'Attendance', url: '/dashboard/attendance', icon: CalendarCheck },
  { title: 'Fitness Tests', url: '/dashboard/fitness', icon: Activity },
];

const playerLinks = [
  { title: 'My Profile', url: '/dashboard', icon: User },
  { title: 'My Progress', url: '/dashboard/progress', icon: TrendingUp },
  { title: 'Goals', url: '/dashboard/goals', icon: Target },
  { title: 'My Videos', url: '/dashboard/videos', icon: Video },
];

const parentLinks = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Progress Reports', url: '/dashboard/reports', icon: ClipboardList },
  { title: 'Schedule', url: '/dashboard/schedule', icon: CalendarCheck },
];

const directorLinks = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Leaderboard', url: '/dashboard/director/leaderboard', icon: Trophy },
  { title: 'Teams', url: '/dashboard/director/teams', icon: Shield },
  { title: 'Players', url: '/dashboard/director/players', icon: Users },
  { title: 'Coaches', url: '/dashboard/director/coaches', icon: Star },
];

const roleLabels: Record<UserRole, string> = {
  coach: 'Coach',
  player: 'Player',
  parent: 'Parent',
  director: 'Director',
};

const roleIcons: Record<UserRole, typeof Shield> = {
  coach: Shield,
  player: User,
  parent: Users,
  director: Building2,
};

export function AppSidebar() {
  const { role, setRole } = useAppContext();
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const links = role === 'coach' ? coachLinks : role === 'player' ? playerLinks : role === 'director' ? directorLinks : parentLinks;
  const RoleIcon = roleIcons[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-3 py-5">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 px-1">
              <img src={caminoLogo} alt="Camino" className="h-8 w-8 rounded-md object-contain" />
              <div>
                <h1 className="font-display font-bold text-foreground text-sm leading-none tracking-tight">Camino</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wide uppercase">Player Development</p>
              </div>
            </div>
          ) : (
            <img src={caminoLogo} alt="Camino" className="h-8 w-8 rounded-md object-contain mx-auto" />
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium px-4 mb-1">
            {!collapsed && 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-[13px] rounded-md"
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium px-4 mb-1">
            {!collapsed && 'Community'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sharedLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-[13px] rounded-md"
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

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-sidebar-accent transition-colors text-[13px] text-sidebar-foreground">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <RoleIcon className="h-3 w-3 text-primary" />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{roleLabels[role]} View</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            {(['coach', 'player', 'parent', 'director'] as UserRole[]).map((r) => {
              const Icon = roleIcons[r];
              return (
                <DropdownMenuItem key={r} onClick={() => { setRole(r); navigate('/dashboard'); }} className={r === role ? 'bg-accent' : ''}>
                  <Icon className="h-3.5 w-3.5 mr-2" />
                  {roleLabels[r]} View
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-destructive/10 transition-colors text-[13px] text-muted-foreground hover:text-destructive mt-1"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
