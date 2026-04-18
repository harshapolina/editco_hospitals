import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, History, MapPin, Phone, Mail, User, Clock, Stethoscope, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prescription } from "@/lib/mockData";


const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, currentDoctor, currentClinic } = useAppContext();
  
  // Determine role dynamically based on logged-in user
  const role = currentDoctor ? 'doctor' : currentClinic ? 'clinic' : 'clinic';
  
  const patient = patients.find(p => p.id === id || p._id === id);


  if (!patient) return <div className="p-10 text-center">Patient not found</div>;

  return (
    <DashboardLayout activeTab={role === 'doctor' ? 'dashboard' : 'patients'} role={role}>
      <div className="flex flex-col gap-8 pb-10 animate-in slide-in-from-right-10 duration-500">
        {/* Top Nav */}
        <button 
          onClick={() => navigate(role === 'doctor' ? '/doctor/dashboard' : '/clinic/dashboard/patients')}
          className="flex items-center gap-2 text-sm text-[#999] hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft size={16} />
          {role === 'doctor' ? 'Back to Dashboard' : 'Back to Patients'}
        </button>

        {/* SECTION A — Patient Profile Header */}
        <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-7 flex flex-col md:flex-row items-center md:items-start gap-8 relative shadow-sm">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl border-4 border-white shadow-md shrink-0">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-[28px] font-semibold text-[#1A1A1A]">{patient.name}</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#F8F8F8] border border-[#EEEEEE] rounded-full self-center md:self-auto">
                <span className="text-[12px] font-semibold text-[#666]">{patient.age} years  ·  {patient.gender === 'F' ? 'Female' : 'Male'}  ·  Blood: {patient.bloodGroup}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-[#666]">
                <Phone size={16} className="text-[#999]" />
                <span className="text-[14px]">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[#666]">
                <Mail size={16} className="text-[#999]" />
                <span className="text-[14px]">{patient.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#666]">
                <MapPin size={16} className="text-[#999]" />
                <span className="text-[14px]">Tashkent, UZ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Visit History Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-[#1A1A1A] flex items-center gap-2">
                  <History size={20} className="text-teal-600" />
                  Visit Timeline & History
                </h3>
                <Badge className="bg-teal-50 text-teal-700 border-none">{patient.opRecords?.length || 0} Visits Total</Badge>
              </div>

              <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                {patient.opRecords && patient.opRecords.length > 0 ? (
                  patient.opRecords.map((rec, i) => (
                    <div key={rec.id || rec._id} className="relative group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 0.1}s` }}>
                      {/* Timeline Dot */}
                      <div className="absolute left-[-29px] top-1 w-5 h-5 rounded-full bg-white border-[3px] border-teal-500 z-10 group-hover:scale-125 transition-transform shadow-sm" />
                      
                      <div className="bg-white border border-gray-100 p-6 rounded-[28px] hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                               <span className="text-[16px] font-bold text-[#1A1A1A]">{rec.diagnosis}</span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full" />
                               <span className="text-[12px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg uppercase tracking-wider">Consultation</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-[#999] font-medium">
                               <Clock size={14} /> {rec.date}
                               <span className="mx-1">•</span>
                               <Stethoscope size={14} /> Dr. {rec.doctorName}
                            </div>
                          </div>
                          <Badge variant="outline" className="border-gray-100 text-gray-400 text-[10px] font-bold py-1 px-3 rounded-xl uppercase tracking-[0.1em]">
                             ID: {rec.id || rec._id}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Summary</p>
                            <p className="text-[14px] text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-50 italic">
                             "{rec.complaint}"
                            </p>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prescription</p>
                            <div className="space-y-2">
                              {rec.prescription?.map((p: Prescription, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-50 rounded-xl shadow-sm">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 bg-teal-500 rounded-full" />
                                      <span className="text-[13px] font-bold text-[#1A1A1A]">{p.medication}</span>
                                   </div>
                                   <span className="text-[11px] font-bold text-teal-600 px-2 py-1 bg-teal-50 rounded-lg">{p.dosage}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                           <div className="text-[12px] text-gray-400 font-medium italic">
                             Next Follow-up: <span className="text-gray-900 font-bold not-italic ml-1">{rec.followUp}</span>
                           </div>
                           <Button variant="ghost" size="sm" className="text-teal-600 font-bold gap-1 hover:bg-teal-50 rounded-xl px-4">
                              Download Script <ArrowRight size={14} />
                           </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 bg-white border border-dashed border-gray-200 rounded-[32px] text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                       <History size={32} />
                    </div>
                    <p className="text-gray-400 font-bold max-w-xs">No medical history found for this patient yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>


          {/* Right Column: Lab Results & Misc */}
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-[16px] font-semibold text-[#1A1A1A] flex items-center gap-2">
                <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center text-primary text-[10px] font-bold">MH</div>
                Medical History
              </h3>
              <div className="bg-white border border-[#EEEEEE] p-5 rounded-2xl shadow-sm text-[13px] text-[#666] leading-relaxed">
                {patient.medicalHistory || "No significant medical history provided."}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[16px] font-semibold text-[#1A1A1A] flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-[10px] font-bold">L</div>
                Latest Lab Results
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Complete Blood Count', date: '10 Mar 2025', result: 'Normal' },
                  { title: 'Lipid Profile', date: '10 Mar 2025', result: 'High Cholesterol' },
                  { title: 'Blood Sugar (F)', date: '05 Feb 2025', result: '94 mg/dL' }
                ].map((lab, i) => (
                  <div key={i} className="bg-white border border-[#EEEEEE] p-4 rounded-xl flex justify-between items-center hover:bg-[#F8F8F8] transition-colors cursor-pointer group shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-[#1A1A1A] group-hover:text-primary transition-colors">{lab.title}</span>
                      <span className="text-[11px] text-[#999]">{lab.date}</span>
                    </div>
                    <span className={`text-[12px] font-bold ${lab.result === 'Normal' || lab.result.includes('mg/dL') ? 'text-[#16A34A]' : 'text-red-500'}`}>
                      {lab.result}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail;
