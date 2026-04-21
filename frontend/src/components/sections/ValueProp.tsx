import { Globe, Link2, Dna, RotateCw, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import doctorWaving from "@/assets/doctor-waving.jpg";
import doctorsConsulting from "@/assets/doctors-consulting.jpg";

const ValueProp = () => {
  return (
    <section id="solutions" className="bg-white">
      <div className="section-container">
        {/* HEADER BLOCK */}
        <div className="max-w-[1000px] mb-20 reveal">
          <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] mb-8">
            Platform Capabilities
          </Badge>
          <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
            A comprehensive <span className="text-primary italic">OS</span> for <br />
            modern medical <span className="hl reveal">excellence.</span>
          </h2>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
          
          {/* LARGE CARD: VOICE AI */}
          <div className="md:col-span-8 md:row-span-2 bg-muted rounded-[48px] p-12 flex flex-col justify-between group overflow-hidden relative reveal">
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <RotateCw size={32} />
              </div>
              <h3 className="text-4xl font-black text-foreground tracking-tight">Voice-First <br/>Clinical Archiving</h3>
              <p className="text-muted-foreground text-lg font-medium max-w-sm leading-relaxed">
                Record consultations in real-time. Our proprietary Saaras-v3 AI handles transcribing and structuring into clinical records.
              </p>
            </div>
            
            {/* ILLUSTRATIVE ELEMENT */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
            <img 
               src={doctorWaving} 
               alt="Digital Health" 
               className="absolute top-0 right-0 w-[400px] h-full object-cover opacity-20 filter grayscale hover:grayscale-0 transition-all duration-1000 pointer-events-none" 
            />
          </div>

          {/* MEDIUM CARD: PATIENT FLOW */}
          <div className="md:col-span-4 md:row-span-1 bg-primary rounded-[48px] p-10 flex flex-col justify-between text-white reveal">
            <Dna size={40} className="opacity-40" />
            <div className="space-y-2">
              <h4 className="text-2xl font-black tracking-tight">Real-time Analytics</h4>
              <p className="text-primary-light/60 text-sm font-bold uppercase tracking-widest">50+ Specialties Supported</p>
            </div>
          </div>

          {/* ACCENT CARD: DEMO */}
          <div className="md:col-span-4 md:row-span-1 bg-accent rounded-[48px] p-10 flex flex-col justify-between group reveal">
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-foreground tracking-tight">Book a Demo</h4>
              <p className="text-foreground/60 text-sm font-bold uppercase tracking-widest leading-none">Seamless Onboarding</p>
            </div>
            <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform duration-500" />
          </div>

          {/* WIDE CARD: CONNECTED CARE */}
          <div className="md:col-span-12 md:row-span-1 border-2 border-border rounded-[48px] p-12 flex flex-col lg:flex-row items-center justify-between gap-10 reveal">
             <div className="space-y-4">
               <h4 className="text-3xl font-black text-foreground tracking-tight">Unifying the Healthcare Ecosystem</h4>
               <p className="text-muted-foreground text-lg font-medium max-w-2xl">
                 Clyra bridges the gap between doctors, clinics, and patients into one intelligent system, processing over 20,000 monthly consultations.
               </p>
             </div>
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-16 h-16 rounded-full border-4 border-white bg-muted overflow-hidden shadow-xl">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" className="w-full h-full object-cover" />
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ValueProp;
