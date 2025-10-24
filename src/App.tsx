import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import ProviderProfile from "./pages/ProviderProfile";
import CustomerProfile from "./pages/CustomerProfile";
import {AdminDashboard} from "./pages/Admin_page/AdminDashboard";
import { AdminProvider } from './components/Admin_User/AdminContext';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostJob from "./pages/PostJob";
import SocialFeed from "./pages/SocialFeed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/admin" element={  <AdminProvider> <AdminDashboard /> </AdminProvider>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/social" element={<SocialFeed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
