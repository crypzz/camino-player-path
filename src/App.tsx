import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import CoachDashboard from "@/pages/CoachDashboard";
import PlayerDashboard from "@/pages/PlayerDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import PlayersPage from "@/pages/PlayersPage";
import EvaluationsPage from "@/pages/EvaluationsPage";
import AttendancePage from "@/pages/AttendancePage";
import VideoAnalysisPage from "@/pages/VideoAnalysisPage";
import ReportsPage from "@/pages/ReportsPage";
import PlayerProgressPage from "@/pages/PlayerProgressPage";
import PlayerGoalsPage from "@/pages/PlayerGoalsPage";
import SchedulePage from "@/pages/SchedulePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import FeedPage from "@/pages/FeedPage";
import PublicProfilePage from "@/pages/PublicProfilePage";
import FitnessTestPage from "@/pages/FitnessTestPage";
import DirectorDashboard from "@/pages/DirectorDashboard";
import DirectorLeaderboardPage from "@/pages/DirectorLeaderboardPage";
import DirectorTeamsPage from "@/pages/DirectorTeamsPage";
import DirectorPlayersPage from "@/pages/DirectorPlayersPage";
import DirectorCoachesPage from "@/pages/DirectorCoachesPage";
import CommunicationsPage from "@/pages/CommunicationsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function DashboardRoutes() {
  const { role } = useAppContext();

  return (
    <DashboardLayout>
      <Routes>
        {/* Shared routes */}
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/communications" element={<CommunicationsPage />} />
        <Route path="/player/:id" element={<PublicProfilePage />} />

        {role === 'coach' && (
          <>
            <Route path="/" element={<CoachDashboard />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/videos" element={<VideoAnalysisPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/fitness" element={<FitnessTestPage />} />
          </>
        )}
        {role === 'player' && (
          <>
            <Route path="/" element={<PlayerDashboard />} />
            <Route path="/progress" element={<PlayerProgressPage />} />
            <Route path="/goals" element={<PlayerGoalsPage />} />
            <Route path="/videos" element={<VideoAnalysisPage />} />
          </>
        )}
        {role === 'parent' && (
          <>
            <Route path="/" element={<ParentDashboard />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </>
        )}
        {role === 'director' && (
          <>
            <Route path="/" element={<DirectorDashboard />} />
            <Route path="/director/leaderboard" element={<DirectorLeaderboardPage />} />
            <Route path="/director/teams" element={<DirectorTeamsPage />} />
            <Route path="/director/players" element={<DirectorPlayersPage />} />
            <Route path="/director/coaches" element={<DirectorCoachesPage />} />
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
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/player/:id" element={<PublicProfilePage />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <DashboardRoutes />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
