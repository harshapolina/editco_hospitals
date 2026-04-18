import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import GetStarted from "./pages/GetStarted.tsx";
import ClinicLogin from "./pages/ClinicLogin.tsx";
import DoctorLogin from "./pages/doctor/DoctorLogin.tsx";
import DoctorRegister from "./pages/doctor/DoctorRegister.tsx";
import ClinicRegister from "./pages/ClinicRegister.tsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.tsx";

import PatientLogin from "./pages/patient/PatientLogin.tsx";
import PatientRegister from "./pages/patient/PatientRegister.tsx";
import PatientDashboard from "./pages/patient/PatientDashboard.tsx";

import ConsultationPage from "./pages/doctor/ConsultationPage.tsx";
import DoctorsTab from "./pages/clinic/DoctorsTab.tsx";
import PatientsTab from "./pages/clinic/PatientsTab.tsx";
import DoctorDetail from "./pages/clinic/DoctorDetail.tsx";
import PatientDetail from "./pages/clinic/PatientDetail.tsx";
import NotificationsTab from "./pages/clinic/NotificationsTab.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/get-started" element={<GetStarted />} />
          
          {/* Clinic Admin Routes */}
          <Route path="/clinic/login" element={<ClinicLogin />} />
          <Route path="/clinic/register" element={<ClinicRegister />} />
          <Route path="/clinic/dashboard" element={<DoctorsTab />} />
          <Route path="/clinic/dashboard/patients" element={<PatientsTab />} />
          <Route path="/clinic/doctor/:id" element={<DoctorDetail />} />
          <Route path="/clinic/patient/:id" element={<PatientDetail />} />
          <Route path="/clinic/notifications" element={<NotificationsTab />} />

          {/* New Doctor Flow Routes */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/consultation/:id" element={<ConsultationPage />} />

          {/* Patient Portal Routes */}
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
