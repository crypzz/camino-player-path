import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import CoachDashboard from "@/pages/CoachDashboard";
import PlayerDashboard from "@/pages/PlayerDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import PlayersPage from "@/pages/PlayersPage";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { role } = useAppContext();

  return (
    <DashboardLayout>
      <Routes>
        {role === 'coach' && (
          <>
            <Route path="/" element={<CoachDashboard />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/evaluations" element={<ComingSoon title="Evaluations" description="Player evaluation forms and history coming soon." />} />
            <Route path="/attendance" element={<ComingSoon title="Attendance" description="Track training and match attendance here." />} />
          </>
        )}
        {role === 'player' && (
          <>
            <Route path="/" element={<PlayerDashboard />} />
            <Route path="/progress" element={<ComingSoon title="My Progress" description="Detailed progress tracking over time." />} />
            <Route path="/goals" element={<ComingSoon title="Goals" description="View and manage your development goals." />} />
          </>
        )}
        {role === 'parent' && (
          <>
            <Route path="/" element={<ParentDashboard />} />
            <Route path="/reports" element={<ComingSoon title="Progress Reports" description="View coach reports and assessments." />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
