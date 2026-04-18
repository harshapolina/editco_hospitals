import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";

const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <div className="section-container">
        {/* Header */}
        <div className="mb-20 animate-on-scroll">
          <h2 className="text-[40px] lg:text-[56px] font-normal text-[#1A1A1A] leading-tight mb-6">
            Simple Steps.<br />
            <span className="italic">Powerful</span> Results.
          </h2>
          <p className="text-[18px] text-[#666] max-w-xl">
            Clyra simplifies the entire clinical workflow into one seamless flow, from the first tap to the final record.
          </p>
        </div>

        {/* 4-step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[
            { 
              num: "01", 
              title: "Start a Consultation", 
              desc: "Doctor records the session with one tap inside the Clyra app." 
            },
            { 
              num: "02", 
              title: "AI Processes Instantly", 
              desc: "Conversation becomes structured medical data in seconds." 
            },
            { 
              num: "03", 
              title: "Review & Confirm", 
              desc: "Doctor verifies the AI summary and sends the prescription." 
            },
            { 
              num: "04", 
              title: "Everything Stored", 
              desc: "Patient history and clinic records update automatically." 
            }
          ].map((step, i) => (
            <div key={i} className="animate-on-scroll relative group">
              <span className="text-[80px] font-black text-[#F4F4F4] leading-none block mb-4 group-hover:text-primary transition-colors">
                {step.num}
              </span>
              <div className="relative mt-2 pl-2">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-4">{step.title}</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
