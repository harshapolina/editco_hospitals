import { ArrowLeft, Edit2, History, Stethoscope } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Doctor, specialties } from "@/lib/mockData";
import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { DoctorRegisterPayload } from "@/types/auth";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors, updateDoctor, patients, currentDoctor, currentClinic, loading } = useAppContext();
  
  // Determine role dynamically and type it for layout compatibility
  const role = (currentDoctor ? 'doctor' : currentClinic ? 'clinic' : 'clinic') as 'clinic' | 'doctor' | 'patient';
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const doctor = doctors.find(d => d._id === id || d.id === id);
  
  // Normalize names for comparison (remove "Dr." prefix and lowercase)
  const normalize = (name: string = "") => name.toLowerCase().replace(/^dr\.?\s*/, '').trim();

  // Derive patients assigned to this doctor
  const doctorPatients = useMemo(() => 
    patients.filter(p => {
      const isById = p.assignedDoctorId && p.assignedDoctorId === (doctor?._id || doctor?.id);
      const isByName = p.assignedDoctor && normalize(p.assignedDoctor) === normalize(doctor?.name || "");
      return isById || isByName;
    }),
    [patients, doctor?.name, doctor?._id, doctor?.id]
  );

  // Derive all OP records belonging to patients of this doctor
  const pastOPRecords = useMemo(() => 
    doctorPatients.flatMap(p => (p.opRecords || []).map(r => ({ ...r, patientName: p.name }))),
    [doctorPatients]
  );

  // Edit states - using RegisterPayload because it includes password/sensitive fields
  const [editData, setEditData] = useState<Partial<DoctorRegisterPayload>>({});

  useEffect(() => {
    setMounted(true);
    if (doctor) setEditData(doctor);
  }, [doctor]);

  if (loading && !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading Doctor Profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
          <Stethoscope size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Doctor Not Found</h2>
        <p className="text-[#999] mb-8 text-center max-w-xs">The medical professional record you're looking for could not be retrieved.</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-primary text-white rounded-xl font-bold">Return Back</button>
      </div>
    );
  }

  const handleSave = async () => {
    await updateDoctor((doctor._id || doctor.id), editData as Partial<Doctor>);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22C55E';
      case 'busy': return '#EF4444';
      case 'break': return '#F59E0B';
      default: return '#999';
    }
  };

  const stats = [
    { label: "Total Today", value: doctor.patientsToday },
    { label: "Completed OPs", value: doctor.completedOPs },
    { label: "Ongoing OP", value: doctor.ongoingOPs },
    { label: "Total Handled", value: doctor.totalHandled }
  ];

  return (
    <DashboardLayout activeTab={role === 'doctor' ? 'dashboard' : 'doctors'} role={role}>
      <div className="flex flex-col gap-8 pb-10 animate-in slide-in-from-right-10 duration-500">
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[#999] hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            {role === 'doctor' ? 'Back to Dashboard' : 'Back to Previous Page'}
          </button>
          {role === 'clinic' && (
            isEditing ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 border border-[#EEEEEE] rounded-lg text-sm font-semibold hover:bg-black/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/95 shadow-md shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-all"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )
          )}
        </div>

        {/* SECTION A — Doctor Profile Header */}
        <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative shadow-sm">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl border-4 border-white shadow-lg overflow-hidden shrink-0">
            {doctor.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  value={editData.name}
                  onChange={e => setEditData({...editData, name: e.target.value})}
                  className="text-[20px] font-bold px-3 py-1 border border-primary/30 rounded-lg w-full outline-none"
                />
                <select 
                  value={editData.specialty}
                  onChange={e => setEditData({...editData, specialty: e.target.value})}
                  className="px-3 py-1 border border-primary/30 rounded-lg outline-none text-sm"
                >
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input 
                  value={editData.phone}
                  onChange={e => setEditData({...editData, phone: e.target.value})}
                  className="px-3 py-1 border border-[#EEEEEE] rounded-lg outline-none text-sm"
                  placeholder="Phone"
                />
                <input 
                  value={editData.email}
                  onChange={e => setEditData({...editData, email: e.target.value})}
                  className="px-3 py-1 border border-[#EEEEEE] rounded-lg outline-none text-sm"
                  placeholder="Email"
                />
                <input 
                  type="password"
                  value={editData.password || ""}
                  onChange={e => setEditData({...editData, password: e.target.value})}
                  className="px-3 py-1 border border-[#EEEEEE] rounded-lg outline-none text-sm"
                  placeholder="New Password"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h1 className="text-[24px] font-semibold text-[#1A1A1A]">{doctor.name}</h1>
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full border border-accent/30 self-center sm:self-auto">
                    <span className="text-[12px] font-semibold text-primary">{doctor.specialty}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F8F8F8] border border-[#EEEEEE] rounded-full self-center sm:self-auto">
                    <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getStatusColor(doctor.status) }}></div>
                    <span className="text-[12px] font-medium text-[#666] capitalize">{doctor.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 mt-4 text-[14px] text-[#666]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#999]">Exp:</span> {doctor.experience} years
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#999]">Phone:</span> {doctor.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#999]">Email:</span> {doctor.email}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECTION B — Stats Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="bg-white border border-[#EEEEEE] rounded-2xl p-6 text-center shadow-sm"
            >
              <div className={`text-[32px] font-bold text-primary transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0 scale-50'}`}>
                {stat.value}
              </div>
              <div className="text-[12px] text-[#999] uppercase tracking-wider font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* SECTION C — Current Activity */}
        <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm">
          <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-4">Current Activity</h3>
          <div className="bg-[#F8F8F8] border border-primary/20 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[12px] text-[#999] uppercase font-bold tracking-tight">Token</span>
                <span className="text-[20px] font-bold text-primary">{doctor.currentToken || "N/A"}</span>
              </div>
              <div className="w-[1px] h-10 bg-[#EEEEEE] hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#999] uppercase font-bold tracking-tight">Patient</span>
                <span className="text-[18px] font-medium text-[#1A1A1A]">
                  {doctorPatients.find(p => p.token === doctor.currentToken)?.name || "No active patient"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium text-[#666]">
                {doctor.status === 'busy' ? 'In Consultation' : doctor.status === 'break' ? 'On Break' : 'Waiting for Patient'}
              </span>
              {doctor.status === 'busy' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full border border-red-100">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-custom"></div>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION D — Today's Patients (Table) */}
        <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#1A1A1A]">Today's Patients ({doctorPatients.length})</h3>
            <button className="text-[13px] font-semibold text-primary hover:underline">Export</button>
          </div>
          <div className="space-y-1">
            {doctorPatients.map((p, i) => (
              <div 
                key={p.id}
                className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F8F8F8] px-2 rounded-lg transition-colors cursor-pointer group"
                onClick={() => navigate(`/clinic/patient/${p.id}`)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-semibold text-[#999] min-w-[32px]">{p.token}</span>
                  <span className="text-[14px] font-medium text-[#1A1A1A] group-hover:text-primary transition-colors">{p.name}</span>
                  <span className="text-[12px] text-[#666] bg-[#EEEEEE]/50 px-2 py-0.5 rounded uppercase font-bold text-[10px]">{p.age}{p.gender}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider
                  ${p.status === 'completed' ? 'bg-[#F0FDF4] text-[#16A34A]' : 
                    p.status === 'consultation' ? 'bg-[#EFF6FF] text-[#2563EB]' : 
                    'bg-[#FFFBEB] text-[#D97706]'}
                `}>
                  {p.status === 'consultation' ? '🔵 In Consultation' : 
                   p.status === 'completed' ? '✅ Completed' : '⏳ Waiting'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION E — Past History */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-semibold text-[#1A1A1A] flex items-center gap-2">
            <History size={18} className="text-[#999]" />
            Past OP Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastOPRecords.length > 0 ? (
              pastOPRecords.map((rec, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F8F8F8] border-l-[4px] border-primary p-5 rounded-r-xl border border-[#EEEEEE] group hover:border-primary transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[14px] font-semibold text-[#1A1A1A]">Patient: {rec.patientName}</span>
                    <span className="text-[12px] text-[#999]">{rec.date}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] text-[#666]"><span className="text-[#999] font-medium italic">Complaint:</span> {rec.complaint}</p>
                    <p className="text-[13px] text-[#666]"><span className="text-[#1A1A1A] font-semibold">Diagnosis:</span> {rec.diagnosis}</p>
                  </div>
                  <button className="mt-4 text-[13px] font-semibold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View full record <ArrowLeft size={14} className="rotate-180" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-10 bg-[#F8F8F8] rounded-xl border border-dashed border-[#EEEEEE] text-center text-[#999]">
                No past OP records found for this doctor's patients.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDetail;
