import { useState } from 'react';
import caminoLogo from '@/assets/camino-logo.png';
import {
  LayoutDashboard, Users, ClipboardList, Video, Target, CalendarCheck,
  User, TrendingUp, Shield, ChevronDown, FileText, LogOut, Trophy, Newspaper, Activity, Building2, Star, MessageCircle, Pencil, Check, X
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
  { title: 'CMSA Standings', url: '/dashboard/cmsa-standings', icon: Shield },
  { title: 'Feed', url: '/dashboard/feed', icon: Newspaper },
  { title: 'Comms Hub', url: '/dashboard/communications', icon: MessageCircle },
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
  { title: 'My CV', url: '/dashboard/cv-builder', icon: FileText },
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
  const { signOut, profile, updateClubName } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const [editingClub, setEditingClub] = useState(false);
  const [clubDraft, setClubDraft] = useState('');
  const [savingClub, setSavingClub] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const startEditClub = () => {
    setClubDraft(profile?.club_name ?? '');
    setEditingClub(true);
  };

  const saveClub = async () => {
    setSavingClub(true);
    await updateClubName(clubDraft);
    setSavingClub(false);
    setEditingClub(false);
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

        {/* Team / Club name — personal banner above the menu */}
        {!collapsed && (
          <div className="px-3 mb-3">
            {editingClub ? (
              <div className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-2 py-1.5">
                <input
                  autoFocus
                  value={clubDraft}
                  onChange={(e) => setClubDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveClub();
                    if (e.key === 'Escape') setEditingClub(false);
                  }}
                  placeholder="e.g. Camino FC"
                  maxLength={40}
                  className="flex-1 bg-transparent outline-none text-[13px] font-display font-semibold text-foreground placeholder:text-muted-foreground/50 min-w-0"
                />
                <button
                  type="button"
                  onClick={saveClub}
                  disabled={savingClub}
                  className="p-1 rounded hover:bg-success/15 text-success transition-colors disabled:opacity-50"
                  aria-label="Save team name"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingClub(false)}
                  className="p-1 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startEditClub}
                className="group w-full flex items-center gap-2 rounded-lg border border-border/60 bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/15 hover:border-primary/30 px-2.5 py-2 transition-all text-left"
              >
                <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                  <Shield className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70 leading-none">
                    {profile?.club_name ? 'Your Team' : 'Add your team'}
                  </p>
                  <p className="font-display font-bold text-[13px] text-foreground truncate leading-tight mt-0.5">
                    {profile?.club_name || 'Tap to set'}
                  </p>
                </div>
                <Pencil className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
              </button>
            )}
          </div>
        )}

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
