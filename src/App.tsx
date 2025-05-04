
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ProgressProvider } from "./contexts/ProgressContext";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ModuleList from "./pages/ModuleList";
import ModuleDetail from "./pages/ModuleDetail";
import LessonDetail from "./pages/LessonDetail";
import UserProgress from "./pages/UserProgress";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ModuleTests from "./pages/ModuleTests";
import TestView from "./pages/TestView";
import { useAuth } from "./contexts/AuthContext";
import { ReactNode } from "react";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // While checking authentication status, show nothing
  if (isLoading) return null;
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the children
  return <>{children}</>;
};

// Wrapper for App to use useAuth hook
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/modules" element={
            <ProtectedRoute>
              <ModuleList />
            </ProtectedRoute>
          } />
          <Route path="/modules/:slug" element={
            <ProtectedRoute>
              <ModuleDetail />
            </ProtectedRoute>
          } />
          <Route path="/modules/:slug/lessons/:lessonId" element={
            <ProtectedRoute>
              <LessonDetail />
            </ProtectedRoute>
          } />
          <Route path="/modules/:slug/tests" element={
            <ProtectedRoute>
              <ModuleTests />
            </ProtectedRoute>
          } />
          <Route path="/modules/:slug/tests/:testId" element={
            <ProtectedRoute>
              <TestView />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <UserProgress />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="light" attribute="class">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ProgressProvider>
            <AppRoutes />
          </ProgressProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
