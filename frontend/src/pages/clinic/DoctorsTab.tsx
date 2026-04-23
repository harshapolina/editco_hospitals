import { useState } from "react";
import { Search, ChevronDown, Plus, User, Stethoscope, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { specialties } from "@/lib/mockData";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DoctorsTab = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor, currentClinic } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [specialtyFilter, setSpecialtyFilter] = useState("All Specialties");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: specialties[0],
    age: 30,
    experience: 5,
    status: 'available' as 'available' | 'busy' | 'break',
    phone: "",
    email: "",
    password: ""
  });

  const filteredDoctors = doctors.filter(doctor => {
    // Strict Clinic Isolation
    const isAssociated = currentClinic && doctor.clinicId === currentClinic.id;
    if (!isAssociated) return false;

    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || doctor.status === statusFilter.toLowerCase();
    const matchesSpecialty = specialtyFilter === "All Specialties" || doctor.specialty === specialtyFilter;
    
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor(newDoctor);
    setIsAddModalOpen(false);
    setNewDoctor({
      name: "",
      specialty: specialties[0],
      age: 30,
      experience: 5,
      status: 'available',
      phone: "",
      email: "",
      password: ""
    });
  };

  return (
    <DashboardLayout activeTab="doctors" role="clinic">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">Doctors</h1>
            <p className="text-[14px] text-[#999] mt-0.5 font-medium">{filteredDoctors.length} doctors currently on your {currentClinic?.name || 'roster'}</p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all w-fit shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                <Plus size={20} />
                Add Doctor
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Doctor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDoctor} className="grid gap-5 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Full Name</label>
                    <input 
                      required
                      value={newDoctor.name}
                      onChange={e => setNewDoctor({...newDoctor, name: e.target.value})}
                      placeholder="e.g. Dr. John Doe"
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Specialty</label>
                    <div className="relative">
                      <select 
                        required
                        value={newDoctor.specialty}
                        onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all text-sm font-medium"
                      >
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Age</label>
                    <input 
                      type="number"
                      required
                      value={newDoctor.age}
                      onChange={e => setNewDoctor({...newDoctor, age: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Exp (Years)</label>
                    <input 
                      type="number"
                      required
                      value={newDoctor.experience}
                      onChange={e => setNewDoctor({...newDoctor, experience: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Phone</label>
                    <input 
                      required
                      value={newDoctor.phone}
                      onChange={e => setNewDoctor({...newDoctor, phone: e.target.value})}
                      placeholder="+998 90 ..."
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Email</label>
                    <input 
                      type="email"
                      required
                      value={newDoctor.email}
                      onChange={e => setNewDoctor({...newDoctor, email: e.target.value})}
                      placeholder="doctor@clinic.com"
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#666]">Password</label>
                    <input 
                      type="password"
                      required
                      value={newDoctor.password}
                      onChange={e => setNewDoctor({...newDoctor, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EEEEEE] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20">
                    Add Doctor to Roster
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
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#FFFFFF] border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-[15px] transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-4 pr-10 py-3 bg-white border border-[#EEEEEE] rounded-2xl text-[14px] font-semibold text-[#666] hover:bg-[#F8F8F8] transition-all min-w-[140px] appearance-none outline-none cursor-pointer shadow-sm"
              >
                <option>All Status</option>
                <option>Available</option>
                <option>Busy</option>
                <option>Break</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={14} />
            </div>
            <div className="relative">
              <select 
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="pl-4 pr-10 py-3 bg-white border border-[#EEEEEE] rounded-2xl text-[14px] font-semibold text-[#666] hover:bg-[#F8F8F8] transition-all min-w-[160px] appearance-none outline-none cursor-pointer shadow-sm"
              >
                <option>All Specialties</option>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {filteredDoctors.map((doctor) => (
              <div 
                key={doctor.id}
                className="group relative bg-[#FFFFFF] border border-[#EEEEEE] rounded-[24px] p-6 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div 
                      onClick={() => navigate(`/clinic/doctor/${doctor.id}`)}
                      className="w-[56px] h-[56px] rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:rotate-3 transition-transform"
                    >
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-[#1A1A1A] group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/clinic/doctor/${doctor.id}`)}>{doctor.name}</h3>
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-primary/80 uppercase tracking-wide mt-0.5">
                        <Stethoscope size={12} />
                        {doctor.specialty}
                      </div>
                    </div>
                  </div>
                  
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className={cn(
                                  "w-[32px] h-[32px] rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm",
                                  doctor.status === 'available' ? 'bg-green-50 border-green-200' : 
                                  doctor.status === 'busy' ? 'bg-red-50 border-red-200' :
                                  'bg-orange-50 border-orange-200'
                                )}>
                                  <div className={cn(
                                    "w-2.5 h-2.5 rounded-full animate-pulse-subtle",
                                    doctor.status === 'available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 
                                    doctor.status === 'busy' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                                    'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'
                                  )} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36 rounded-xl p-1.5 shadow-2xl border-none">
                                <DropdownMenuItem 
                                  onClick={() => updateDoctor(doctor.id, { status: 'available' })}
                                  className="flex items-center gap-2 rounded-lg cursor-pointer focus:bg-green-50 focus:text-green-600 font-semibold text-xs py-2"
                                >
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  Available
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateDoctor(doctor.id, { status: 'busy' })}
                                  className="flex items-center gap-2 rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-600 font-semibold text-xs py-2"
                                >
                                  <div className="w-2 h-2 rounded-full bg-red-500" />
                                  Busy
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateDoctor(doctor.id, { status: 'break' })}
                                  className="flex items-center gap-2 rounded-lg cursor-pointer focus:bg-orange-50 focus:text-orange-600 font-semibold text-xs py-2"
                                >
                                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                                  Break
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black text-white text-[10px] font-bold py-1 px-2 rounded-md">
                            Toggle Status
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to permanently remove Dr. ${doctor.name}? This action cannot be undone.`)) {
                          deleteDoctor(doctor._id || doctor.id);
                        }
                      }}
                      className="w-[32px] h-[32px] rounded-lg border border-red-100 bg-red-50/50 text-red-500 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white group/trash ml-1"
                    >
                      <Trash2 size={14} className="group-hover/trash:scale-110 transition-transform" />
                    </button>

                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#F8F8F8] p-3 rounded-2xl border border-[#F0F0F0]">
                    <span className="text-[10px] text-[#999] uppercase font-bold tracking-wider">Experience</span>
                    <p className="text-[14px] font-bold text-[#1A1A1A]">{doctor.experience} Years</p>
                  </div>
                  <div className="bg-[#F8F8F8] p-3 rounded-2xl border border-[#F0F0F0]">
                    <span className="text-[10px] text-[#999] uppercase font-bold tracking-wider">Age</span>
                    <p className="text-[14px] font-bold text-[#1A1A1A]">{doctor.age} Yrs</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 text-[#666] font-medium">
                      <User size={14} className="text-[#999]" />
                      Patients today
                    </div>
                    <span className="font-bold text-[#1A1A1A]">{doctor.patientsToday}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 text-[#666] font-medium">
                      Current Token
                    </div>
                    <span className={`font-bold ${doctor.currentToken ? 'text-primary' : 'text-[#666]'}`}>
                      {doctor.currentToken || "Offline"}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/clinic/doctor/${doctor.id}`)}
                  className="w-full mt-7 h-11 bg-[#F8F8F8] border border-[#EEEEEE] text-[#1A1A1A] rounded-xl text-[13px] font-bold hover:bg-[#1A1A1A] hover:text-white hover:shadow-xl transition-all duration-300"
                >
                  View Full Profile
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#F8F8F8] rounded-[32px] border border-dashed border-[#EEEEEE]">
            <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mb-6">
              <Stethoscope size={40} className="text-primary/30" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">No results found</h3>
            <p className="text-[#999] mt-2 mb-8 max-w-[280px]">We couldn't find any doctors matching your search filters.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All Status");
                setSpecialtyFilter("All Specialties");
              }}
              className="text-primary font-bold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorsTab;
