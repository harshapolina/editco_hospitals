import { Plus, Check, ArrowRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import heroDoctor from "@/assets/hero-doctor.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-transparent min-h-screen flex flex-col relative overflow-hidden">
      {/* PROFESSIONAL NAV BAR */}
      <nav className="fixed top-6 left-0 right-0 z-[100] px-8 lg:px-20">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between bg-white/80 backdrop-blur-2xl border border-white/40 shadow-premium rounded-3xl px-8 py-4 reveal">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Plus className="text-white w-5 h-5" strokeWidth={3} />
            </div>
            <span className="text-2xl font-black text-foreground tracking-tighter">CLYRA</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12 font-bold text-[13px] uppercase tracking-widest text-muted-foreground">
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <button 
              onClick={() => navigate('/get-started')}
              className="bg-foreground text-white px-10 py-4 rounded-2xl font-black text-[12px] hover:bg-primary transition-all shadow-xl active:scale-95"
            >
              ACCESS PORTAL
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row items-center section-container !pt-48 lg:!pt-20">
        
        {/* TEXT CONTENT */}
        <div className="w-full lg:w-3/5 space-y-12 pr-0 lg:pr-20 reveal-stagger">
          <div className="space-y-6">
            <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
              Medical AI Architecture v2.0
            </Badge>
            <h1 className="text-6xl lg:text-[110px] leading-[0.85] font-black text-foreground tracking-[-0.05em]">
              The future of <br />
              <span className="text-primary italic font-medium">clinical</span> clarity.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
              A high-fidelity workspace for doctors. Transcribe consultations, automate records, and manage patient flow with precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => navigate('/get-started')}
              className="bg-primary text-white h-20 px-12 rounded-[24px] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95"
            >
              Deploy Clinic <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => window.open('https://calendly.com', '_blank')}
              className="bg-white border-2 border-border text-foreground h-20 px-12 rounded-[24px] font-black text-xl hover:bg-muted transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Watch Video
            </button>
          </div>
        </div>

        {/* VISUALS */}
        <div className="w-full lg:w-2/5 relative mt-20 lg:mt-0">
          <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-premium reveal">
            <img 
              src={heroDoctor} 
              alt="Medical Professional" 
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent mix-blend-multiply" />
            
            {/* FLOATING CARD 1 */}
            <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl space-y-4 animate-on-scroll">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <Activity size={24} />
                 </div>
                 <div className="space-y-0.5">
                   <p className="font-black text-foreground text-lg">Integrated Sarvam AI</p>
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">v3.0 Clinical Stack</p>
                 </div>
               </div>
            </div>
          </div>

          {/* BACKGROUND BLUR DECOR */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -z-10" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
