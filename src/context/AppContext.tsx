import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/types/player';
import { useAuth } from '@/hooks/useAuth';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [role, setRole] = useState<UserRole>('coach');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role) {
      setRole(profile.role as UserRole);
    }
  }, [profile]);

  return (
    <AppContext.Provider value={{ role, setRole, selectedPlayerId, setSelectedPlayerId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
