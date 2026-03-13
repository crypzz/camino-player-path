import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types/player';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('coach');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

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
