
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" attribute="class">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ProgressProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/modules" element={<ModuleList />} />
                  <Route path="/modules/:slug" element={<ModuleDetail />} />
                  <Route path="/modules/:slug/lessons/:lessonId" element={<LessonDetail />} />
                  <Route path="/modules/:slug/tests" element={<ModuleTests />} />
                  <Route path="/modules/:slug/tests/:testId" element={<TestView />} />
                  <Route path="/progress" element={<UserProgress />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ProgressProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
