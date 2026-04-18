import { Smartphone, MessageSquare, Clock, Heart, Search } from "lucide-react";
import appDoctor from "@/assets/app-doctor.jpg";
import womanCouch from "@/assets/woman-couch.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";

const ForPatients = () => {
  return (
    <section id="patients">
      <div className="section-container">
        {/* Header Block */}
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block bg-[#D4EC6B] text-[#1A1A1A] rounded-full px-5 py-2 text-[13px] font-bold mb-6">
            For Patients
          </span>
          <h2 className="text-[40px] lg:text-[56px] font-normal leading-tight text-[#1A1A1A] tracking-tight">
            Your Health,<br />
            Clearly <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary align-middle mx-1"><Heart className="text-white w-6 h-6" /></span> Managed
          </h2>
        </div>

        {/* 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] items-center">
          {/* Left Column: Phone Mockup */}
          <div className="animate-on-scroll bg-[#EEF0FF] rounded-[40px] p-[60px] flex items-center justify-center min-h-[520px]">
            <div className="w-full max-w-[260px] aspect-[1/2] bg-[#1A1A1A] rounded-[48px] overflow-hidden p-2.5 shadow-2xl origin-bottom">
              <div className="w-full h-full bg-white rounded-[38px] flex flex-col overflow-hidden">
                 <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-[12px] text-white">+</span>
                      </div>
                      <span className="text-[12px] font-bold">Clyra</span>
                    </div>
                    <Search className="w-4 h-4 text-[#999]" />
                 </div>
                 <div className="flex-1 px-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-[20px]" />
                    <img src={appDoctor} alt="" className="w-full h-full object-cover rounded-[20px]" />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-sm">
                       <p className="text-[10px] font-bold text-[#1A1A1A]">Consultation Ready</p>
                       <p className="text-[9px] text-[#666]">AI summary generated.</p>
                    </div>
                 </div>
                 <div className="p-5 space-y-3">
                    <p className="text-[10px] text-[#999] font-bold uppercase tracking-widest">Your Care Team</p>
                    <div className="flex gap-2 overflow-hidden">
                       {[avatar1, avatar2, avatar3, avatar4].map((a, i) => (
                         <img key={i} src={a} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cards Group */}
          <div className="flex flex-col gap-[24px]">
             {/* Main Message Card */}
             <div className="animate-on-scroll bg-[#F8F8F8] border border-[#EEEEEE] rounded-[32px] p-[40px]">
                <h3 className="text-[24px] font-bold text-[#1A1A1A] mb-6">No confusion. Just clarity.</h3>
                <p className="text-[17px] text-[#666] leading-relaxed mb-8">
                  Stay connected with your health journey in one place. Access everything from prescriptions to AI-summarized insights instantly.
                </p>
                <div className="space-y-4">
                   {[
                     'View consultation history',
                     'Access prescriptions anytime',
                     'Upload and manage medical records',
                     'Book appointments easily'
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                           <Clock className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[15px] text-[#1A1A1A] font-medium">{item}</span>
                     </div>
                   ))}
                </div>
             </div>

             {/* Secondary Image Card */}
             <div className="animate-on-scroll relative rounded-[32px] overflow-hidden h-[200px] shadow-lg group">
                <img src={womanCouch} alt="" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                   <p className="text-white text-[18px] font-medium">Your Health, Reimagined.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForPatients;
