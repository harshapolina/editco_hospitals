import { Mail, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Waitlist = () => {
  return (
    <section id="waitlist" className="bg-white py-40">
      <div className="section-container">
        <div className="bg-foreground text-white rounded-[60px] p-20 lg:p-32 shadow-premium relative overflow-hidden reveal">
          {/* BACKGROUND BLUR DECOR */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
            <div className="space-y-6">
              <Badge className="bg-white/5 text-white border-white/10 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
                Join the Deployment Queue
              </Badge>
              <h2 className="text-5xl lg:text-8xl font-black text-white tracking-[-0.04em] leading-[0.85]">
                Ready for the <span className="text-primary">next</span> <br />
                generation?
              </h2>
              <p className="text-muted-foreground text-xl lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                We are gradually rolling out access to verified clinics. Secure your place in the future of healthcare.
              </p>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                window.location.href = `mailto:editcomediaoffical@gmail.com?subject=Access Request for Clyra&body=Hello, I would like to request access for my clinic. My contact email is: ${email}`;
              }}
              className="flex flex-col sm:flex-row max-w-xl mx-auto p-1.5 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl items-center"
            >
              <input 
                type="email" 
                name="email"
                required
                placeholder="Doctor@clinic.com" 
                className="flex-1 bg-transparent border-none rounded-full px-8 py-4 text-white placeholder:text-white/20 focus:outline-none transition-all font-bold text-lg w-full"
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-10 py-4 rounded-full font-black text-lg hover:scale-[1.03] transition-all whitespace-nowrap shadow-2xl shadow-primary/40 active:scale-95"
              >
                REQUEST ACCESS
              </button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-white/5">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Verified Providers Only</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-widest text-white/40">HIPAA Compliant Protocol</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;
