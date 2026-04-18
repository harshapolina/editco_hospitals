import { Linkedin, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white overflow-hidden pb-12 mt-32">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          width: 100%;
        }
        .marquee-content {
          display: flex;
          flex-shrink: 0;
          min-width: 100%;
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Infinite Scroll Marquee */}
      <div className="py-12 border-t border-white/5 overflow-hidden">
         <div className="marquee-container opacity-20 hover:opacity-100 transition-opacity">
            <div className="marquee-content gap-20">
               {[1,2,3,4,5,6].map(i => (
                 <span key={i} className="text-[120px] font-black tracking-tighter text-white">CLYRA</span>
               ))}
            </div>
            <div className="marquee-content gap-20">
               {[1,2,3,4,5,6].map(i => (
                 <span key={i} className="text-[120px] font-black tracking-tighter text-white">CLYRA</span>
               ))}
            </div>
         </div>
      </div>

      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-[40px] pt-[48px] pb-[80px] items-start border-t border-white/10">
          {/* Column 1: Navigation */}
          <div className="flex flex-col gap-6">
             <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-[10px] text-white">+</span>
                </div>
                <span className="text-lg font-bold">Clyra</span>
             </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                 <a href="/" className="text-[14px] text-white/60 hover:text-white transition-colors">Home</a>
                 <a href="#doctors" className="text-[14px] text-white/60 hover:text-white transition-colors">Doctors</a>
                 <a href="#clinics" className="text-[14px] text-white/60 hover:text-white transition-colors">Clinics</a>
                 <a href="#patients" className="text-[14px] text-white/60 hover:text-white transition-colors">Patients</a>
                 <a href="#waitlist" className="text-[14px] text-white/60 hover:text-white transition-colors">Contact</a>
              </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest leading-none">Socials</h4>
            <div className="flex flex-col gap-2">
               <a href="#" className="text-[15px] font-medium hover:text-primary transition-colors">LinkedIn</a>
               <a href="#" className="text-[15px] font-medium hover:text-primary transition-colors">Instagram</a>
               <a href="#" className="text-[15px] font-medium hover:text-primary transition-colors">YouTube</a>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest leading-none">Location</h4>
            <div className="flex flex-col gap-2">
               <p className="text-[15px] font-medium">India</p>
               <p className="text-[15px] text-white/60">support@clyra.com</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-6 lg:items-end">
             <button className="bg-white text-[#1A1A1A] px-8 py-3 rounded-full font-bold text-[14px] hover:bg-primary hover:text-white transition-all w-fit">
                Contact Us Now
             </button>
             <div className="flex gap-4">
                <Linkedin className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
                <Instagram className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
                <Youtube className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
             </div>
          </div>
        </div>
        
        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-[12px] text-white/40">© 2026 Clyra. All rights reserved.</p>
           <p className="text-[12px] text-white/40 italic">Clear care, powered by intelligence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
