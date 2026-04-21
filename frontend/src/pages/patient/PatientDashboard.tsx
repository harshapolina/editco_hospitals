import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  Upload, 
  Mic, 
  Plus, 
  ChevronRight, 
  Activity,
  Award,
  Download,
  PlayCircle,
  Stethoscope,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';

// --- Sub-components (Moved up to fix hoisting errors) ---

interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  color: 'emerald' | 'rose' | 'sky' | 'amber';
  icon: React.ReactNode;
  trend?: string;
}

const StatCard = ({ title, value, sub, color, icon, trend }: StatCardProps) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <Card className="border border-[#EEEEEE] shadow-sm rounded-[32px] overflow-hidden bg-white hover:translate-y-[-6px] transition-all duration-500 hover:shadow-2xl hover:shadow-[#F0F0F0] relative group">
      <CardContent className="p-8 flex flex-col items-start gap-6">
        <div className={`w-14 h-14 ${colorMap[color]} rounded-2xl flex items-center justify-center shadow-lg shadow-black/5`}>
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[12px] font-bold text-[#999] uppercase tracking-widest">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-[#1A1A1A] tracking-tighter">{value}</h3>
            <span className="text-sm font-bold text-[#BBB]">{sub}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mt-4 px-3 py-1 rounded-full border w-fit ${trend === 'Normal' || trend === 'Excellent' || trend === 'Optimal' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
              <CheckCircle2 size={12} /> {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const RecordUploadModal = ({ onUploaded }: { onUploaded: () => void }) => {
  const { currentPatient, uploadPatientRecord } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    notes: string;
    report: File | null;
    voice: File | null;
  }>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    report: null,
    voice: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.report) {
      toast.error("Please provide a title and attachment.");
      return;
    }

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('date', formData.date);
      data.append('notes', formData.notes);
      data.append('report', formData.report);
      if (formData.voice) data.append('voice', formData.voice);

      await uploadPatientRecord(currentPatient.id || currentPatient._id, data);
      setIsUploading(false);
      setIsOpen(false);
      onUploaded();
      toast.success("Medical record saved successfully!");
      
      // Cleanup
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        report: null,
        voice: null
      });
    } catch (error: any) {
       setIsUploading(false);
       toast.error(error.response?.data?.message || "Upload failed. Please check your connection.");
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-[#1A1A1A] hover:bg-black text-white rounded-[20px] shadow-2xl h-14 px-8 font-black text-sm tracking-wide transition-all active:scale-95"
      >
        <Plus size={20} className="mr-2" /> Upload New Record
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
       <div className="absolute inset-0" onClick={() => !isUploading && setIsOpen(false)} />
       <Card className="w-full max-w-[540px] border-none shadow-2xl rounded-[40px] overflow-hidden bg-white relative z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
          <CardHeader className="bg-[#F9F9F9] border-b border-[#F0F0F0] p-10">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <CardTitle className="text-2xl font-black text-[#1A1A1A] tracking-tight">New Medical Record</CardTitle>
                   <CardDescription className="text-sm font-medium text-[#999]">Store your clinical findings securely in the cloud</CardDescription>
                </div>
                <button 
                   onClick={() => !isUploading && setIsOpen(false)} 
                   className="w-10 h-10 rounded-full bg-white border border-[#EEE] flex items-center justify-center text-[#999] hover:text-[#1A1A1A] transition-all"
                >
                  ✕
                </button>
             </div>
          </CardHeader>
          <CardContent className="p-10">
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] px-1">Record Title</label>
                   <Input 
                      placeholder="e.g. Full Blood Count" 
                      className="h-14 bg-[#F8F8F8] border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] px-1">Date of Issue</label>
                    <Input 
                        type="date" 
                        className="h-14 bg-[#F8F8F8] border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] px-1">Record Category</label>
                    <div className="relative">
                      <select className="w-full h-14 px-4 bg-[#F8F8F8] border-none rounded-2xl font-bold outline-none appearance-none focus:ring-2 focus:ring-primary/10 cursor-pointer">
                         <option>Lab Report</option>
                         <option>Prescription</option>
                         <option>Imaging (X-Ray/MRI)</option>
                         <option>Discharge Summary</option>
                      </select>
                      <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#BBB] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] px-1">Attach Findings (PDF / JPG)</label>
                   <div className="relative group/upload">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => setFormData({...formData, report: e.target.files ? e.target.files[0] : null})}
                        required
                      />
                      <div className={`h-24 px-8 border-2 border-dashed rounded-3xl flex items-center justify-between transition-all ${formData.report ? 'border-primary bg-primary/5' : 'border-[#EEE] bg-[#F8F8F8] group-hover/upload:border-primary/40'}`}>
                         <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.report ? 'bg-primary text-white' : 'bg-white text-[#BBB]'}`}>
                              <FileText size={24} />
                           </div>
                           <div className="flex flex-col">
                              <span className={`text-[15px] font-bold truncate max-w-[240px] ${formData.report ? 'text-primary' : 'text-[#BBB]'}`}>
                                 {formData.report ? formData.report.name : 'Click to select or drag file'}
                              </span>
                              <span className="text-[10px] text-[#BBB] font-bold uppercase tracking-widest mt-0.5">Max file size 5MB</span>
                           </div>
                         </div>
                         <Upload size={20} className={formData.report ? 'text-primary' : 'text-[#BBB]'} />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] px-1">Voice Insight (Optional)</label>
                   <div className="flex gap-4">
                      <div className="relative flex-1">
                         <input 
                            type="file" 
                            accept="audio/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={(e) => setFormData({...formData, voice: e.target.files ? e.target.files[0] : null})}
                         />
                         <div className="h-14 px-6 bg-[#F8F8F8] border border-transparent rounded-2xl flex items-center justify-between transition-all hover:bg-[#F0F0F0]">
                            <span className="text-[#999] text-sm font-bold truncate">
                               {formData.voice ? formData.voice.name : 'Attach voice explanation...'}
                            </span>
                            <Mic size={18} className="text-blue-500" />
                         </div>
                      </div>
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                         <Mic size={24} />
                      </div>
                   </div>
                </div>

                <Button 
                   type="submit" 
                   disabled={isUploading}
                   className="w-full h-16 bg-primary hover:bg-primary/95 text-white rounded-[24px] text-lg font-black shadow-2xl shadow-primary/20 mt-4 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                   {isUploading ? (
                     <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="tracking-tight">Analyzing & Securely Saving...</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2">
                        Complete Upload <Plus size={24} />
                     </div>
                   )}
                </Button>
             </form>
          </CardContent>
       </Card>
    </div>
  );
};

const PatientDashboard = () => {
  const { currentPatient, logoutPatient, bookAppointment, uploadPatientRecord, doctors, clinics } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';
  
  const [activeTab, setActiveTabRaw] = useState(tabFromUrl);
  
  // Sync tab state when URL changes
  useEffect(() => {
    setActiveTabRaw(tabFromUrl);
  }, [tabFromUrl]);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    setActiveTabRaw(tab);
  };
  const [timeline, setTimeline] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Appointment Booking
  const [bookingData, setBookingData] = useState({
    clinicId: '',
    doctorId: '',
    date: '',
    time: ''
  });

  const fetchPatientData = async () => {
    if (!currentPatient) return;
    try {
      const id = currentPatient.id || currentPatient._id;
      const [timelineRes, appointmentsRes] = await Promise.all([
        api.get(`/patients/${id}/timeline`),
        api.get(`/patients/${id}/appointments`)
      ]);
      setTimeline(timelineRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error("Error fetching patient data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentPatient) {
      navigate('/patient/login');
      return;
    }
    fetchPatientData();
  }, [currentPatient]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookAppointment({
        ...bookingData,
        patientId: currentPatient.id || currentPatient._id
      });
      // Force refresh data
      await fetchPatientData();
      setActiveTab('appointments');
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-\/]/);
      if (parts.length === 3) {
        return { month: 'APR', day: parts[0].length === 4 ? parts[2] : parts[0] };
      }
      return { month: 'APR', day: '18' };
    }
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString().padStart(2, '0')
    };
  };

  if (!currentPatient) return null;

  return (
    <DashboardLayout activeTab={activeTab} role="patient">
      <div className="flex flex-col gap-10 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Stats / Overview */}
        {/* Shared Header for Overview and Timeline */}
        {(activeTab === 'overview' || activeTab === 'timeline') && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-[32px] font-bold text-[#1A1A1A] tracking-tight">
                {activeTab === 'overview' ? 'Your Health Overview' : 'Your Health History'}
              </h1>
              <p className="text-[16px] text-[#999] font-medium">
                {activeTab === 'overview' ? 'Monitoring your vitals and upcoming visits' : 'Chronological record of your medical journey'}
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-[#F8F8F8] p-1.5 rounded-2xl border border-[#EEEEEE]">
              <button 
                 onClick={() => setActiveTab('overview')}
                 className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-primary shadow-sm border border-[#EEEEEE]' : 'text-[#999] hover:text-[#666]'}`}
              >
                Insights
              </button>
              <button 
                 onClick={() => setActiveTab('timeline')}
                 className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'timeline' ? 'bg-white text-primary shadow-sm border border-[#EEEEEE]' : 'text-[#999] hover:text-[#666]'}`}
              >
                History
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard 
                title="Blood Group" 
                value={currentPatient?.vitals?.bloodGroup || currentPatient?.bloodGroup || 'O+'} 
                sub="Rare Hero" 
                color="emerald" 
                icon={<Award size={24} />} 
              />
              <StatCard 
                title="Pulse Rate" 
                value={currentPatient?.vitals?.pulseRate || '--'} 
                sub="BPM" 
                color="rose" 
                icon={<Activity size={24} />} 
                trend={currentPatient?.vitals?.pulseRate ? "Normal" : ""} 
              />
              <StatCard 
                title="Oxygen" 
                value={currentPatient?.vitals?.oxygenLevel || '--'} 
                sub="Levels" 
                color="sky" 
                icon={<Activity size={24} />} 
                trend={currentPatient?.vitals?.oxygenLevel ? "Excellent" : ""} 
              />
              <StatCard 
                title="BMI" 
                value={currentPatient?.vitals?.bmi || '--'} 
                sub="Health Score" 
                color="amber" 
                icon={<Award size={24} />} 
                trend={currentPatient?.vitals?.bmi ? "Optimal" : ""} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
              {/* Upcoming Appt */}
              <Card className="lg:col-span-2 border border-[#EEEEEE] shadow-sm rounded-[32px] overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-[#F5F5F5]">
                  <div>
                    <CardTitle className="text-xl font-bold">Upcoming Appointments</CardTitle>
                    <CardDescription className="text-sm font-medium">Your next visit to the clinic</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('appointments')}
                    className="bg-primary hover:bg-primary/95 text-white rounded-2xl shadow-lg shadow-primary/20 px-6 h-11 font-bold"
                  >
                    <Plus size={20} className="mr-2" /> Book New
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {appointments.filter(a => a.status === 'upcoming').length > 0 ? (
                    <div className="divide-y divide-[#F5F5F5]">
                      {appointments.filter(a => a.status === 'upcoming').map((apt) => {
                        const { month, day } = formatDate(apt.date);
                        return (
                          <div key={apt._id} className="p-8 flex items-center justify-between group hover:bg-[#F9F9F9]/50 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                            <div className="flex items-center gap-8 z-10">
                              <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-[#2D7A65] rounded-[24px] flex flex-col items-center justify-center shadow-xl shadow-primary/20 transform group-hover:rotate-3 transition-transform duration-500">
                                  <span className="text-[11px] font-black text-white/70 uppercase tracking-[0.2em]">{month}</span>
                                  <span className="text-3xl font-black text-white leading-none mt-1">{day}</span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-4 border-[#F9F9F9] flex items-center justify-center shadow-sm">
                                  <Calendar size={14} className="text-primary" />
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-1.5">
                                    <h4 className="font-black text-xl text-[#1A1A1A] tracking-tight group-hover:text-primary transition-colors">Dr. {apt.doctorName}</h4>
                                    <Badge className="bg-emerald-500 text-white border-none hover:bg-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] px-2.5 h-5 flex items-center justify-center shadow-md shadow-emerald-100">Verified</Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-[#666] text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {apt.clinicName}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2.5 bg-white border border-[#EEEEEE] px-4 py-2 rounded-2xl shadow-sm group-hover:border-primary/20 transition-colors">
                                    <Clock size={16} className="text-primary animate-pulse-custom" /> 
                                    <span className="text-sm font-black text-[#1A1A1A]">{apt.time}</span>
                                  </div>
                                  <div className="bg-[#1A1A1A] text-white px-5 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-black/10 group-hover:bg-primary transition-colors">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Token</span>
                                    <span className="text-sm font-black">#{apt.tokenNumber || '00'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 delay-100">
                               <Button variant="outline" className="rounded-2xl font-black border-[#EEEEEE] h-12 px-6 hover:bg-primary hover:text-white hover:border-primary shadow-sm active:scale-95 transition-all">
                                 Reschedule
                               </Button>
                               <Button className="rounded-2xl w-12 h-12 p-0 bg-[#F8F8F8] text-[#1A1A1A] hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all shadow-sm flex items-center justify-center">
                                 <Plus className="rotate-45" size={24} />
                               </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (

                    <div className="p-24 text-center">
                      <div className="w-24 h-24 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-[#EEEEEE]">
                        <Calendar className="text-[#BBB] w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1A1A]">No upcoming visits</h3>
                      <p className="text-[#999] font-medium text-sm mt-1 max-w-[240px] mx-auto">Stay on top of your health by scheduling a regular checkup.</p>
                      <Button onClick={() => setActiveTab('appointments')} className="mt-8 bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl h-11 px-8 font-bold border-none">
                        Start Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions / Activity */}
              <div className="space-y-8">
                <Card className="border-none shadow-xl shadow-primary/10 rounded-[32px] bg-gradient-to-br from-[#1A1A1A] to-[#333] text-white overflow-hidden relative group h-[260px]">
                  <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/40 transition-all duration-700" />
                  <CardHeader className="relative z-10 p-8">
                    <CardTitle className="text-2xl font-bold leading-tight">Secure Cloud <br />Records</CardTitle>
                    <CardDescription className="text-white/60 font-medium">Everything in one safe place</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 p-8 pt-0">
                    <button 
                      onClick={() => setActiveTab('records')}
                      className="w-full h-16 bg-primary hover:bg-white hover:text-primary transition-all duration-500 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-xl shadow-black/20"
                    >
                      <Upload size={20} />
                      Upload New File
                    </button>
                    <p className="text-[10px] text-white/40 text-center mt-4 font-bold uppercase tracking-[0.2em]">End-to-end encrypted</p>
                  </CardContent>
                </Card>

                <Card className="border border-[#EEEEEE] shadow-sm rounded-[32px] bg-white overflow-hidden flex-1 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-[#1A1A1A]">Health Vitals</h4>
                    <Activity size={20} className="text-primary" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold text-[#666]">
                           <span>Hydration</span>
                           <span>85%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-sky-500 rounded-full w-[85%]" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold text-[#666]">
                           <span>Daily Steps</span>
                           <span>7,420 / 10k</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 rounded-full w-[74%]" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold text-[#666]">
                           <span>Sleep Quality</span>
                           <span>Great</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-purple-500 rounded-full w-[90%]" />
                        </div>
                     </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Appointments Tab / Booking */}
        {activeTab === 'appointments' && (
          <div className="max-w-4xl mx-auto w-full space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-[36px] font-black text-[#1A1A1A] tracking-tight">Schedule Your Visit</h2>
              <p className="text-[16px] text-[#999] font-medium">Choose a clinical specialist and pick a comfortable time</p>
            </div>

            <Card className="border border-[#EEEEEE] shadow-2xl rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl">
              <CardContent className="p-10">
                <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-bold text-[#1A1A1A] tracking-widest uppercase px-1">1. Choose Medical Center</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clinics.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => setBookingData({...bookingData, clinicId: c.id, doctorId: ''})}
                          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${bookingData.clinicId === c.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-[#EEEEEE] bg-white hover:border-primary/30'}`}
                        >
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                             {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[15px] text-[#1A1A1A]">{c.name}</p>
                            <p className="text-[12px] text-[#999] font-medium">{c.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-bold text-[#1A1A1A] tracking-widest uppercase px-1">2. Select Specialist</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       {doctors
                        .filter(d => !bookingData.clinicId || d.clinicId === bookingData.clinicId)
                        .map(doc => (
                          <div 
                            key={doc.id} 
                            onClick={() => setBookingData({...bookingData, doctorId: doc.id})}
                            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${bookingData.doctorId === doc.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-[#EEEEEE] bg-white hover:border-primary/20'}`}
                          >
                             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-primary shadow-sm border border-[#EEEEEE] overflow-hidden">
                                {doc.image ? <img src={doc.image} className="w-full h-full object-cover" /> : doc.name.split(' ').pop().charAt(0)}
                             </div>
                             <div className="overflow-hidden">
                               <p className="font-bold text-[13px] text-[#1A1A1A] truncate text-nowrap">Dr. {doc.name.split(' ').pop()}</p>
                               <p className="text-[10px] text-primary font-bold uppercase tracking-wider truncate">{doc.specialty}</p>
                             </div>
                          </div>
                      ))}
                      {doctors.filter(d => !bookingData.clinicId || d.clinicId === bookingData.clinicId).length === 0 && (
                        <div className="col-span-3 py-6 text-center text-[#999] font-medium border-2 border-dashed border-[#EEEEEE] rounded-3xl">
                          Select a clinic first to see available doctors
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#1A1A1A] tracking-widest uppercase px-1">3. Date of Visit</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#EEEEEE] focus:ring-2 focus:ring-primary/10 focus:border-primary rounded-2xl font-bold outline-none shadow-sm transition-all"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#1A1A1A] tracking-widest uppercase px-1">4. Preferred Slot</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                      <select 
                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#EEEEEE] focus:ring-2 focus:ring-primary/10 focus:border-primary rounded-2xl font-bold outline-none shadow-sm transition-all appearance-none"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                        required
                      >
                         <option value="">Select Time Slot</option>
                         <optgroup label="Morning">
                           <option value="09:00 AM">09:00 AM</option>
                           <option value="10:30 AM">10:30 AM</option>
                           <option value="12:00 PM">12:00 PM</option>
                         </optgroup>
                         <optgroup label="Evening">
                           <option value="04:30 PM">04:30 PM</option>
                           <option value="06:00 PM">06:00 PM</option>
                           <option value="07:30 PM">07:30 PM</option>
                         </optgroup>
                      </select>
                    </div>
                  </div>

                  <Button className="md:col-span-2 w-full h-16 bg-primary hover:bg-primary/95 text-white rounded-[24px] text-lg font-black shadow-2xl shadow-primary/30 mt-6 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    Confirm My Appointment <ChevronRight size={24} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-[32px] font-black text-[#1A1A1A] tracking-tight">Your Digital Archieve</h2>
                <p className="text-[16px] text-[#999] font-medium tracking-wide">Manage, view and share your medical findings securely</p>
              </div>
              <RecordUploadModal onUploaded={fetchPatientData} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {timeline.filter(t => t.type === 'Medical Record').length > 0 ? (
                timeline.filter(t => t.type === 'Medical Record').map(rec => (
                  <Card key={rec.id} className="border border-[#EEEEEE] shadow-sm rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer group hover:translate-y-[-8px]">
                    <div className="h-48 bg-[#F8F8F8] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {rec.data.fileType === 'pdf' ? (
                          <FileText size={80} className="text-[#DDD] group-hover:text-primary/20 transition-colors" strokeWidth={1} />
                        ) : (
                          <Activity size={80} className="text-[#DDD] group-hover:text-primary/20 transition-colors" strokeWidth={1} />
                        )}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 translate-y-4 group-hover:translate-y-0">
                            <Button size="icon" className="rounded-[20px] w-14 h-14 bg-white text-primary hover:bg-primary hover:text-white shadow-xl"><PlayCircle size={28} /></Button>
                            <Button size="icon" className="rounded-[20px] w-14 h-14 bg-white text-primary hover:bg-primary hover:text-white shadow-xl"><Download size={28} /></Button>
                        </div>
                    </div>
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{rec.date}</span>
                            <Badge className="bg-[#F8F8F8] text-[#999] border-none font-bold text-[10px] uppercase tracking-tighter px-2">LAB REPORT</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-primary transition-colors">{rec.title}</h3>
                        <p className="text-sm text-[#999] line-clamp-2 leading-relaxed font-medium">{rec.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-24 text-center">
                  <div className="w-24 h-24 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-[#EEEEEE]">
                    <Upload className="text-[#BBB] w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A]">No records found</h3>
                  <p className="text-[#999] font-medium text-sm mt-1 max-w-[240px] mx-auto">Upload your first lab report or prescription to start your cloud history.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Health Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="max-w-5xl mx-auto space-y-12 py-10 w-full animate-in fade-in duration-700">
             <div className="relative pt-16">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-[#EEEEEE] to-transparent -ml-px" />
                
                <div className="space-y-16">
                  {timeline.length > 0 ? timeline.map((item, index) => (
                    <div key={item.id} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Dot */}
                      <div className="absolute left-8 md:left-1/2 w-5 h-5 rounded-full bg-white border-[5px] border-primary shadow-lg z-10 -ml-2.5 outline outline-8 outline-white" />
                      
                      <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-20' : 'md:pl-20'}`}>
                        <Card className="border border-[#EEEEEE] shadow-sm rounded-[36px] overflow-hidden hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
                          <CardHeader className="p-8 pb-4">
                             <div className="flex items-center justify-between mb-4">
                                <span className="text-[12px] font-black text-primary uppercase tracking-[0.2em]">{item.date}</span>
                                <Badge className={`bg-white border text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${item.type === 'Consultation' ? 'text-blue-500 border-blue-100' : 'text-emerald-500 border-emerald-100'}`}>
                                  {item.type}
                                </Badge>
                             </div>
                             <CardTitle className="text-2xl font-black text-[#1A1A1A] tracking-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-8 pt-0">
                             <p className="text-[#666] leading-relaxed font-medium text-[15px] mb-6">{item.description}</p>
                             {item.type === 'Consultation' && (
                               <div className="pt-6 border-t border-[#F5F5F5] flex items-center justify-between">
                                  <div className="flex gap-2">
                                     <Badge variant="secondary" className="bg-[#F8F8F8] text-[#999] text-[10px] rounded-lg px-2">Clinical Report</Badge>
                                     <Badge variant="secondary" className="bg-[#F8F8F8] text-[#999] text-[10px] rounded-lg px-2">Vitals</Badge>
                                  </div>
                                  <Button variant="link" className="p-0 h-auto text-primary font-bold text-sm flex items-center gap-1 group/btn">
                                    Full Summery <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                  </Button>
                               </div>
                             )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center">
                       <p className="text-[#999] font-medium">Your health journey is just beginning.</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// --- End of Dashboard ---

export default PatientDashboard;
