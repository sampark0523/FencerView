import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { VideoProvider } from "./contexts/VideoContext";
import Index from "./pages/Index";
import Review from "./pages/Review";
import Library from "./pages/Library";
import Welcome from "./pages/Welcome";
import StyleGuide from "./pages/StyleGuide";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hideBottomNav = ["/welcome", "/styles"].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/styles" element={<StyleGuide />} />
        <Route path="/" element={<Index />} />
        <Route path="/library" element={<Library />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideBottomNav && <BottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VideoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </VideoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
