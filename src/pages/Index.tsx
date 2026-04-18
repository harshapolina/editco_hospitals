import { useEffect } from "react";
import Hero from "@/components/sections/Hero";
import ValueProp from "@/components/sections/ValueProp";
import BuiltForClinics from "@/components/sections/BuiltForClinics";
import ForDoctors from "@/components/sections/ForDoctors";
import ForClinics from "@/components/sections/ForClinics";
import ForPatients from "@/components/sections/ForPatients";
import HowItWorks from "@/components/sections/HowItWorks";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/sections/Footer";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll, .reveal, .reveal-stagger').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Hero />
      <ValueProp />
      <BuiltForClinics />
      <ForDoctors />
      <ForClinics />
      <ForPatients />
      <HowItWorks />
      <Waitlist />
      <Footer />
    </main>
  );
};

export default Index;
