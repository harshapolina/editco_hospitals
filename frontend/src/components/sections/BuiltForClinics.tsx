import { Zap, ShieldCheck, Target, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BuiltForClinics = () => {
  return (
    <section id="about" className="bg-foreground py-20 lg:py-40 relative overflow-hidden">
      {/* DECORATIVE BLOOM */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-30 -z-10" />

      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32">
          
          <div className="w-full lg:w-1/2 space-y-12 reveal">
            <div className="space-y-6">
              <Badge className="bg-primary/20 text-primary-light border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
                Enterprise Infrastructure
              </Badge>
              <h2 className="text-5xl lg:text-8xl font-black text-white tracking-[-0.04em] leading-[0.85]">
                Built for the <br />
                <span className="text-primary italic">modern</span> clinic.
              </h2>
              <p className="text-muted-foreground text-xl font-medium max-w-lg leading-relaxed">
                Clyra consolidates clinical administration, medical records, and digital diagnostics into one unified patient-centric operating system.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl">
                    <Zap size={28} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-black text-white text-lg">Instant Sync</h4>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Zero Latency Architecture</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl">
                    <ShieldCheck size={28} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-black text-white text-lg">AES-256 Vault</h4>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Bank-Grade Data Security</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 reveal">
             <div className="bg-white rounded-[60px] p-16 shadow-premium relative group overflow-hidden">
                <div className="space-y-10 relative z-10">
                   <div className="inline-block bg-primary text-white rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-widest">Efficiency Benchmark</div>
                   <h3 className="text-4xl lg:text-5xl font-black text-foreground leading-[0.95] tracking-tighter">Simplifying complexity into a singular flow.</h3>
                   
                   <div className="space-y-6">
                      {[
                        'Automated Intake Documentation',
                        'Voice-Synthesized Prescriptions',
                        'Intelligent Patient Queue management'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group/item">
                           <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary transition-colors duration-300">
                             <Check size={14} className="text-primary group-hover/item:text-white" />
                           </div>
                           <span className="text-lg text-muted-foreground font-semibold group-hover/item:text-foreground transition-colors">{item}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-all duration-1000" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BuiltForClinics;
