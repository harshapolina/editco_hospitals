import { LayoutDashboard, Users, BarChart3, ClipboardList } from "lucide-react";

const ForClinics = () => {
  return (
    <section id="clinics">
      <div className="section-container">
        {/* Header Block */}
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block bg-[#D4EC6B] text-[#1A1A1A] rounded-full px-5 py-2 text-[13px] font-bold mb-6">
            For Clinics
          </span>
          <h2 className="text-[40px] lg:text-[56px] font-normal leading-tight text-[#1A1A1A] tracking-tight">
            Run Your Clinic<br />
            Like a <span className="text-primary italic">System</span>
          </h2>
          <p className="mt-6 text-[18px] text-[#666] max-w-2xl mx-auto">
            Manage doctors, patient flow, and operations with complete visibility and intelligence.
          </p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {[
            { 
              Icon: LayoutDashboard, 
              title: "Real-time OP tracking", 
              desc: "Monitor every consultation and patient movement in real-time." 
            },
            { 
              Icon: Users, 
              title: "Queue Management", 
              desc: "Automated token systems to reduce wait times and crowding." 
            },
            { 
              Icon: BarChart3, 
              title: "Doctor Insights", 
              desc: "Performance metrics and workload distribution at a glance." 
            },
            { 
              Icon: ClipboardList, 
              title: "Centralized Records", 
              desc: "Unified patient history accessible across your entire facility." 
            }
          ].map((item, i) => (
            <div key={i} className="animate-on-scroll bg-[#F8F8F8] border border-[#EEEEEE] rounded-[32px] p-[32px] hover:border-primary transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <item.Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[19px] font-bold text-[#1A1A1A] mb-4">{item.title}</h3>
              <p className="text-[15px] text-[#666] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForClinics;
