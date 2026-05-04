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
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CookiesPage from "@/pages/CookiesPage";
import AboutPage from "@/pages/AboutPage";
import UnsubscribePage from "@/pages/UnsubscribePage";
import CPIInfoPage from "@/pages/features/CPIPage";
import VideoAnalysisInfoPage from "@/pages/features/VideoAnalysisPage";
import EvaluationsInfoPage from "@/pages/features/EvaluationsPage";
import FitnessTestingInfoPage from "@/pages/features/FitnessTestingPage";
import CommunicationHubInfoPage from "@/pages/features/CommunicationHubPage";
import ForCoachesPage from "@/pages/roles/ForCoachesPage";
import ForPlayersPage from "@/pages/roles/ForPlayersPage";
import ForParentsPage from "@/pages/roles/ForParentsPage";
import ForDirectorsPage from "@/pages/roles/ForDirectorsPage";
import HowCPIWorksPage from "@/pages/resources/HowCPIWorksPage";
import MethodologyPage from "@/pages/resources/MethodologyPage";
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
import CMSAStandingsPage from "@/pages/CMSAStandingsPage";
import FeedPage from "@/pages/FeedPage";
import PublicProfilePage from "@/pages/PublicProfilePage";
import FitnessTestPage from "@/pages/FitnessTestPage";
import DirectorDashboard from "@/pages/DirectorDashboard";
import DirectorLeaderboardPage from "@/pages/DirectorLeaderboardPage";
import DirectorTeamsPage from "@/pages/DirectorTeamsPage";
import DirectorPlayersPage from "@/pages/DirectorPlayersPage";
import DirectorCoachesPage from "@/pages/DirectorCoachesPage";
import CommunicationsPage from "@/pages/CommunicationsPage";
import CVBuilderPage from "@/pages/CVBuilderPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (!session) return <Navigate to="/admin" replace />;
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
        <Route path="/cv-builder" element={<CVBuilderPage />} />
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
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/unsubscribe" element={<UnsubscribePage />} />
              {/* Platform feature pages */}
              <Route path="/platform/cpi" element={<CPIInfoPage />} />
              <Route path="/platform/video-analysis" element={<VideoAnalysisInfoPage />} />
              <Route path="/platform/evaluations" element={<EvaluationsInfoPage />} />
              <Route path="/platform/fitness-testing" element={<FitnessTestingInfoPage />} />
              <Route path="/platform/communication-hub" element={<CommunicationHubInfoPage />} />
              {/* Built for pages */}
              <Route path="/for/coaches" element={<ForCoachesPage />} />
              <Route path="/for/players" element={<ForPlayersPage />} />
              <Route path="/for/parents" element={<ForParentsPage />} />
              <Route path="/for/directors" element={<ForDirectorsPage />} />
              {/* Resource pages */}
              <Route path="/resources/how-cpi-works" element={<HowCPIWorksPage />} />
              <Route path="/resources/methodology" element={<MethodologyPage />} />
              {/* Hidden internal access — not linked publicly */}
              <Route path="/admin" element={<AuthPage />} />
              {/* Waitlist mode: lock down public app surfaces */}
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route path="/cv/:slug" element={<Navigate to="/" replace />} />
              <Route path="/player/:id" element={<Navigate to="/" replace />} />
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
