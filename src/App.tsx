import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import LandingPage from "@/pages/LandingPage";
import CoachDashboard from "@/pages/CoachDashboard";
import PlayerDashboard from "@/pages/PlayerDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import PlayersPage from "@/pages/PlayersPage";
import EvaluationsPage from "@/pages/EvaluationsPage";
import AttendancePage from "@/pages/AttendancePage";
import VideoAnalysisPage from "@/pages/VideoAnalysisPage";
import ReportsPage from "@/pages/ReportsPage";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function DashboardRoutes() {
  const { role } = useAppContext();

  return (
    <DashboardLayout>
      <Routes>
        {role === 'coach' && (
          <>
            <Route path="/" element={<CoachDashboard />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/videos" element={<VideoAnalysisPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </>
        )}
        {role === 'player' && (
          <>
            <Route path="/" element={<PlayerDashboard />} />
            <Route path="/progress" element={<ComingSoon title="Detailed Progress" description="Deep-dive into your performance metrics over time." />} />
            <Route path="/goals" element={<ComingSoon title="My Goals" description="Track and manage your development goals." />} />
            <Route path="/videos" element={<VideoAnalysisPage />} />
          </>
        )}
        {role === 'parent' && (
          <>
            <Route path="/" element={<ParentDashboard />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/schedule" element={<ComingSoon title="Training Schedule" description="View upcoming training sessions and matches." />} />
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
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
