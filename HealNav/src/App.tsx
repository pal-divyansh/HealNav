import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SymptomChecker from "./pages/SymptomChecker";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Education from "./pages/Education";
import Notifications from "./pages/Notifications";
import MedicalBot from "./pages/MedicalBot";
import Articles from './pages/education/Articles';
import Videos from './pages/education/Videos';
import Webinars from './pages/education/Webinars';
import Tools from './pages/education/Tools';
import MentalHealth from './pages/education/articles/MentalHealth';
import Nutrition from './pages/education/articles/Nutrition';
import HealthCommunity from './pages/education/Community';
import HeartHealth from './pages/education/articles/HeartHealth';
import Fitness from './pages/education/articles/Fitness';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/symptoms" element={<SymptomChecker />} />
          <Route path="/community" element={<Community />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/education" element={<Education />} />
          <Route path="/education/articles" element={<Articles />} />
          <Route path="/education/videos" element={<Videos />} />
          <Route path="/education/webinars" element={<Webinars />} />
          <Route path="/education/tools" element={<Tools />} />
          <Route path="/education/articles/mental-health" element={<MentalHealth />} />
          <Route path="/education/articles/nutrition" element={<Nutrition />} />
          <Route path="/education/community" element={<HealthCommunity />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/medical-bot" element={<MedicalBot />} />
          <Route path="/education/articles/heart-health" element={<HeartHealth />} />
          <Route path="/education/articles/fitness" element={<Fitness />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;