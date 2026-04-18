import { useState } from "react";
import { Search, ChevronDown, Plus, Calendar, UserCheck, Users } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const PatientsTab = () => {
  const { patients, doctors, addPatient, currentClinic } = useAppContext();
  const clinicDoctors = doctors.filter(doc => currentClinic && doc.clinicId === currentClinic.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: 25,
    gender: 'M' as 'M' | 'F',
    assignedDoctor: clinicDoctors[0]?.name || "",
    assignedDoctorId: clinicDoctors[0]?.id || "",
    bloodGroup: "O+",
    phone: "",
    email: "",
    medicalHistory: ""
  });

  const filteredPatients = patients.filter(patient => {
    // Strict Clinic Isolation
    const isAssociated = currentClinic && patient.clinicId === currentClinic.id;
    if (!isAssociated) return false;

    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoctor = doctorFilter === "All Doctors" || patient.assignedDoctor === doctorFilter;
    return matchesSearch && matchesDoctor;
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient(newPatient);
    setIsAddModalOpen(false);
    setNewPatient({
      name: "",
      age: 25,
      gender: 'M',
      assignedDoctor: clinicDoctors[0]?.name || "",
      assignedDoctorId: clinicDoctors[0]?.id || "",
      bloodGroup: "O+",
      phone: "",
      email: "",
      medicalHistory: ""
    });
  };

  return (
    <DashboardLayout activeTab="patients" role="clinic">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">Patients</h1>
            <p className="text-[14px] text-[#999] mt-0.5 font-medium">{filteredPatients.length} total patients in your {currentClinic?.name || 'care'}</p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all w-fit shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                <Plus size={20} />
                Add Patient
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Register New Patient</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPatient} className="grid gap-5 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Full Name</label>
                    <input 
                      required
                      value={newPatient.name}
                      onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                      placeholder="e.g. Jane Smith"
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Age</label>
                    <input 
                      type="number"
                      required
                      value={newPatient.age}
                      onChange={e => setNewPatient({...newPatient, age: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Gender</label>
                    <div className="relative">
                      <select 
                        required
                        value={newPatient.gender}
                        onChange={e => setNewPatient({...newPatient, gender: e.target.value as 'M' | 'F'})}
                        className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all text-sm font-medium"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Blood Group</label>
                    <input 
                      required
                      value={newPatient.bloodGroup}
                      onChange={e => setNewPatient({...newPatient, bloodGroup: e.target.value})}
                      placeholder="e.g. A+"
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Assigned Doctor</label>
                    <div className="relative">
                      <select 
                        required
                        value={newPatient.assignedDoctorId}
                        onChange={e => {
                          const doc = clinicDoctors.find(d => (d.id === e.target.value || d._id === e.target.value));
                          setNewPatient({
                            ...newPatient, 
                            assignedDoctorId: e.target.value,
                            assignedDoctor: doc?.name || ""
                          });
                        }}
                        className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all text-sm font-medium"
                      >
                        {clinicDoctors.map(d => <option key={d.id} value={d.id || d._id}>{d.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20">
                    Register Patient Record
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input 
              type="text"
              placeholder="Search by patient name or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#FFFFFF] border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-[15px] transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <select 
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="pl-4 pr-10 py-3 bg-white border border-[#EEEEEE] rounded-2xl text-[14px] font-semibold text-[#666] hover:bg-[#F8F8F8] transition-all min-w-[200px] outline-none appearance-none outline-none cursor-pointer shadow-sm"
            >
              <option value="All Doctors">All Doctors</option>
              {clinicDoctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={14} />
          </div>
        </div>

        {/* Patient Grid */}
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.id}
                onClick={() => navigate(`/clinic/patient/${patient.id}`)}
                className="group relative bg-[#FFFFFF] border border-[#EEEEEE] rounded-[24px] p-6 cursor-pointer hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-[56px] h-[56px] rounded-2xl bg-[#F0F7F4] flex items-center justify-center text-primary font-bold text-xl transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1A1A1A] group-hover:text-primary transition-colors">{patient.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                       <p className="text-[13px] text-[#666] font-medium">
                        {patient.gender === 'F' ? 'Female' : 'Male'} · Age {patient.age}
                       </p>
                       <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        patient.status === 'consultation' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                        patient.status === 'completed' ? 'bg-green-50 text-green-600' :
                        'bg-purple-50 text-purple-600'
                       }`}>
                         {patient.status || 'waiting'}
                       </span>
                    </div>
                  </div>

                </div>

                <div className="bg-[#F8F8F8] rounded-2xl p-4 border border-[#F0F0F0] space-y-3 mb-6">
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 text-[#666] font-medium">
                      <Calendar size={14} className="text-[#999]" />
                      Last visit
                    </div>
                    <span className="font-bold text-[#1A1A1A]">{patient.lastVisit}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 text-[#666] font-medium">
                      <UserCheck size={14} className="text-[#999]" />
                      Doctor
                    </div>
                    <span className="font-bold text-primary">{patient.assignedDoctor}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/clinic/patient/${patient.id}`);
                  }}
                  className="w-full mt-auto h-11 bg-white border border-[#EEEEEE] text-[#1A1A1A] rounded-xl text-[13px] font-bold hover:bg-[#1A1A1A] hover:text-white hover:shadow-xl transition-all duration-300"
                >
                  View Health Profile
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#F8F8F8] rounded-[32px] border border-dashed border-[#EEEEEE]">
            <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mb-6">
              <Users size={40} className="text-primary/30" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">No matches found</h3>
            <p className="text-[#999] mt-2 mb-8 max-w-[280px]">Try adjusting your search or selecting a different doctor.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setDoctorFilter("All Doctors");
              }}
              className="text-primary font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientsTab;
