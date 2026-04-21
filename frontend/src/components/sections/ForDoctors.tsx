import { TrendingUp } from "lucide-react";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import doctorTeam from "@/assets/doctor-team.jpg";

const ForDoctors = () => {
  return (
    <section id="doctors">
      <div className="section-container">
        {/* Header Block */}
        <div className="text-center mb-12 animate-on-scroll">
          <span className="inline-block bg-[#D4EC6B] text-[#1A1A1A] rounded-full px-5 py-2 text-[13px] font-bold mb-6">
            For Doctors
          </span>
          <h2 className="text-[34px] lg:text-[44px] font-normal leading-tight text-[#1A1A1A]">
            Focus on Care, Not<br />
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary align-middle mx-1"><TrendingUp className="text-white w-5 h-5" /></span> Documentation
          </h2>
        </div>

        {/* 3-column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] items-stretch">
          {/* Card 1 */}
          <div className="animate-on-scroll bg-[#F8F8F8] rounded-[24px] p-[32px] flex flex-col min-h-[360px] border border-[#EEEEEE]">
            <div className="flex -space-x-2 mb-auto">
              {[avatar1, avatar2, avatar3, avatar4].map((a, i) => (
                <img key={i} src={a} alt="" className="w-10 h-10 rounded-full border-2 border-[#F8F8F8] object-cover" />
              ))}
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-4 leading-tight">
                Record consultations in one tap.
              </h3>
              <p className="text-[15px] text-[#666] leading-relaxed">
                Capture every detail effortlessly. Our AI handles the heavy lifting of transcription while you engage with your patient.
              </p>
            </div>
          </div>

          {/* Card 2 - List */}
          <div className="animate-on-scroll bg-[#F8F8F8] rounded-[24px] overflow-hidden flex flex-col border border-[#EEEEEE] p-[32px]">
            <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-6">Built for speed.</h3>
            <ul className="space-y-4">
               {[
                 'Get instant AI summaries',
                 'Generate prescriptions effortlessly',
                 'Access patient history instantly'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-[15px] text-[#666]">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    {item}
                 </li>
               ))}
            </ul>
            <p className="mt-8 text-[14px] font-bold text-primary">Grow your practice without increasing your workload.</p>
          </div>

          {/* Card 3 - Feedback */}
          <div className="animate-on-scroll bg-[#F8F8F8] rounded-[24px] p-[32px] flex flex-col justify-center items-center min-h-[360px] relative overflow-hidden text-center border border-[#EEEEEE]">
             <div className="w-[180px] h-[180px] relative mb-6">
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-20">
                  <line x1="100" y1="100" x2="40" y2="40" stroke="#000" strokeWidth="1" />
                  <line x1="100" y1="100" x2="160" y2="50" stroke="#000" strokeWidth="1" />
                  <line x1="100" y1="100" x2="30" y2="150" stroke="#000" strokeWidth="1" />
                  <line x1="100" y1="100" x2="170" y2="160" stroke="#000" strokeWidth="1" />
                </svg>
                {[
                  { t: '5%', l: '40%', s: '40px' },
                  { t: '50%', l: '10%', s: '32px' },
                  { t: '70%', l: '70%', s: '48px' },
                  { t: '10%', l: '75%', s: '36px' },
                  { t: '40%', l: '45%', s: '44px' },
                ].map((pos, i) => (
                  <div key={i} className="absolute rounded-full border-2 border-white shadow-sm overflow-hidden" style={{ top: pos.t, left: pos.l, width: pos.s, height: pos.s }}>
                    <img src={[avatar1, avatar2, avatar3, avatar4, avatar1][i]} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <p className="text-[17px] italic text-[#1A1A1A] font-medium leading-relaxed">
               "Clyra transformed my clinic operations. Documentation is now instantaneous."
             </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-[64px] grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-[#EEEEEE] pt-16">
          {[
            { n: '60+', l: 'Simplified Workflows' },
            { n: '30%', l: 'Time Saved' },
            { n: '10k+', l: 'AI Summaries' },
            { n: '24/7', l: 'Records Access' },
          ].map((stat, i) => (
            <div key={i} className="animate-on-scroll flex flex-col gap-2">
              <span className="text-[44px] font-bold text-[#1A1A1A] leading-none">{stat.n}</span>
              <span className="text-[13px] font-bold text-[#999] uppercase tracking-widest">{stat.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForDoctors;
