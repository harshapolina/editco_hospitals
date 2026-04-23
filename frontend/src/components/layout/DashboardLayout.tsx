import { ReactNode, useState, useEffect } from "react";
import { Plus, Bell, Users, Stethoscope, LogOut, Settings, UserCircle, Menu, X, Check, ChevronDown, ChevronLeft, LayoutDashboard, Calendar, FileText, Clock } from "lucide-react";

import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  fullWidth?: boolean;
  hideTopNavButtons?: boolean;
  role?: 'clinic' | 'doctor' | 'patient';
}

const DashboardLayout = ({ 
  children, 
  activeTab, 
  fullWidth = false,
  hideTopNavButtons = false,
  role = 'clinic'
}: DashboardLayoutProps) => {
  const { notifications, markNotificationAsRead, logout, currentClinic, currentDoctor, currentPatient, updateClinic } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [clinicName, setClinicName] = useState(currentClinic?.name || "Clinic Portal");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings form state
  const [settingsData, setSettingsData] = useState({
    name: currentClinic?.name || "",
    phone: currentClinic?.phone || "",
    address: currentClinic?.address || "",
    email: currentClinic?.email || ""
  });

  // Sync state with currentClinic when it changes (e.g. after login/registration)
  useEffect(() => {
    if (currentClinic) {
      setClinicName(currentClinic.name);
      setSettingsData({
        name: currentClinic.name,
        phone: currentClinic.phone || "",
        address: currentClinic.address || "",
        email: currentClinic.email
      });
    }
  }, [currentClinic]);

  const filteredNotifications = notifications.filter(n => {
    // Show role-specific and 'all' notifications
    if (n.targetRole !== 'all' && n.targetRole !== role) return false;
    
    // If it's for a specific doctor, check if it matches
    if (role === 'doctor' && n.doctorId && currentDoctor) {
      return n.doctorId === (currentDoctor._id || currentDoctor.id);
    }
    
    // If it's for a clinic, check if it matches (Clinic Portal)
    if (role === 'clinic' && n.clinicId && currentClinic) {
      return n.clinicId === (currentClinic._id || currentClinic.id);
    }

    // If it's for a patient, check if it matches
    if (role === 'patient' && n.patientId && currentPatient) {
      return n.patientId === (currentPatient._id || currentPatient.id);
    }
    
    return true;
  });

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  const sidebarItems = role === 'doctor' 
    ? [
        { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/doctor/dashboard' },
      ]
    : role === 'patient'
    ? [
        { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/patient/dashboard?tab=overview' },
        { id: 'appointments', name: 'Appointments', icon: <Calendar size={20} />, path: '/patient/dashboard?tab=appointments' },
        { id: 'records', name: 'Records', icon: <FileText size={20} />, path: '/patient/dashboard?tab=records' },
        { id: 'timeline', name: 'Timeline', icon: <Clock size={20} />, path: '/patient/dashboard?tab=timeline' },
      ]
    : [
        { id: 'doctors', name: 'Doctors', icon: <Stethoscope size={20} />, path: '/clinic/dashboard' },
        { id: 'patients', name: 'Patients', icon: <Users size={20} />, path: '/clinic/dashboard/patients' },
      ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      {/* TOP BAR */}
      <header className="h-16 border-b border-[#EEEEEE] bg-white flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#1A1A1A] leading-tight">
                {role === 'doctor' ? 'Doctor Portal' : role === 'patient' ? 'Patient Portal' : 'Clyra'}
              </span>
              <span className="text-[10px] text-[#999] font-medium tracking-wider uppercase">
                {role === 'doctor' ? 'Clinical Workspace' : role === 'patient' ? 'My Health Workspace' : 'Clinic CRM'}
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {role === 'clinic' && (
              <>
                {isEditingName ? (
                  <div className="flex items-center gap-2 ml-2">
                    <input 
                      autoFocus
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                      className="px-2 py-1 text-[16px] font-semibold border rounded border-primary outline-none"
                    />
                  </div>
                ) : (
                  <h2 
                    onClick={() => setIsEditingName(true)}
                    className="text-[15px] font-bold text-[#1A1A1A] cursor-pointer hover:text-primary px-2 transition-colors ml-2"
                    title="Click to edit clinic name"
                  >
                    {clinicName}
                  </h2>
                )}
              </>
            )}
            {role !== 'clinic' && (
              <h2 className="text-[15px] font-bold text-[#1A1A1A] px-2 ml-2">
                {role === 'doctor' ? `Dr. ${currentDoctor?.name}` : currentPatient?.name}
              </h2>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {role === 'doctor' && (
            <div className="hidden lg:flex items-center gap-2 mr-4">
              <button 
                onClick={() => navigate('/get-started')}
                className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors"
              >
                Switch Portal
              </button>
              <div className="w-[1px] h-6 bg-border mx-1"></div>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-bold text-[#666] border border-border rounded-xl hover:bg-gray-50 hover:border-primary transition-all"
              >
                Go to Website
              </button>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-6 py-2 text-sm font-bold bg-[#1A1A1A] hover:bg-black text-white rounded-xl shadow-lg transition-all ml-1"
              >
                Sign Out
              </button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 text-[#666] hover:bg-[#F8F8F8] rounded-2xl transition-all relative outline-none border border-transparent hover:border-[#EEEEEE]">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] p-0 rounded-2xl shadow-2xl border border-[#EEEEEE] bg-white overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-[#EEEEEE] flex items-center justify-between bg-[#F8F8F8]">
                <h3 className="font-bold text-[15px]">Notifications</h3>
                {unreadCount > 0 && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{unreadCount} New</span>}
              </div>
              <div className="max-h-[380px] overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.slice(0, 5).map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        navigate('/clinic/notifications');
                      }}
                      className={`p-4 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F8F8F8] cursor-pointer transition-colors relative ${!notif.isRead ? 'bg-[#F0F7F4]' : 'bg-white'}`}
                    >
                      {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-none"></div>}
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-[13px] ${!notif.isRead ? 'font-bold' : 'font-semibold'} text-[#1A1A1A]`}>{notif.title}</h4>
                        <span className="text-[10px] text-[#999] font-medium">{notif.time}</span>
                      </div>
                      <p className="text-[12px] text-[#666] line-clamp-2 leading-relaxed">{notif.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-[#999] text-sm font-medium">No new activity to show.</div>
                )}
              </div>
              <div className="p-3 text-center border-t border-[#EEEEEE] bg-[#F8F8F8]/30">
                <button 
                  onClick={() => navigate('/clinic/notifications')}
                  className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors py-1 w-full"
                >
                  View All Activity Logs
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 rounded-2xl hover:bg-[#F8F8F8] transition-all outline-none border border-[#EEEEEE] hover:border-primary/20">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-[14px] shadow-lg shadow-primary/20">
                  {role === 'patient' 
                    ? (currentPatient?.name || 'P').split(' ').map(n => n[0]).join('') 
                    : role === 'doctor'
                    ? (currentDoctor?.name || 'D').split(' ').map(n => n[0]).join('')
                    : (clinicName || 'C').split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:flex flex-col items-start pr-2">
                  <span className="text-[12px] font-bold text-[#1A1A1A] leading-none">
                    {role === 'patient' ? 'Patient' : role === 'doctor' ? 'Doctor' : 'Admin'}
                  </span>
                  <ChevronDown size={12} className="text-[#999] mt-0.5" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[260px] p-2 rounded-2xl shadow-2xl border border-[#EEEEEE] bg-white animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3 p-3.5 mb-2 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/10">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-primary/20">
                  {role === 'patient' 
                    ? (currentPatient?.name || 'P').split(' ').map(n => n[0]).join('') 
                    : role === 'doctor'
                    ? (currentDoctor?.name || 'D').split(' ').map(n => n[0]).join('')
                    : (clinicName || 'C').split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[15px] font-bold text-[#1A1A1A] truncate leading-tight">
                    {role === 'patient' ? currentPatient?.name : role === 'doctor' ? currentDoctor?.name : clinicName}
                  </span>
                  <span className="text-[11px] text-[#666] font-medium truncate mt-0.5">
                    {role === 'patient' ? currentPatient?.email : role === 'doctor' ? currentDoctor?.email : settingsData.email}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-[#EEEEEE] mx-1 mb-1" />
              {role === 'clinic' ? (
                <>
                  <DropdownMenuItem 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3.5 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer font-bold transition-all border border-transparent focus:border-primary/10 mb-1"
                  >
                    <Settings size={18} className="mr-3 text-primary/70" />
                    <span className="text-[13px]">Clinic Profile & Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/clinic/dashboard')}
                    className="p-3.5 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer font-bold transition-all border border-transparent focus:border-primary/10 mb-1"
                  >
                    <Stethoscope size={18} className="mr-3 text-primary/70" />
                    <span className="text-[13px]">Manage Doctors</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/clinic/dashboard/patients')}
                    className="p-3.5 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer font-bold transition-all border border-transparent focus:border-primary/10 mb-1"
                  >
                    <Users size={18} className="mr-3 text-primary/70" />
                    <span className="text-[13px]">Manage Patients</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/clinic/notifications')}
                    className="p-3.5 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer font-bold transition-all border border-transparent focus:border-primary/10"
                  >
                    <Bell size={18} className="mr-3 text-primary/70" />
                    <span className="text-[13px]">Activity Logs</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem 
                    className="p-3 focus:bg-[#F0F7F4] focus:text-primary rounded-xl cursor-pointer font-semibold transition-colors"
                  >
                    <UserCircle size={18} className="mr-3 opacity-70" />
                    <span className="text-sm">My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="p-3 focus:bg-[#F0F7F4] focus:text-primary rounded-xl cursor-pointer font-semibold transition-colors"
                  >
                    <Settings size={18} className="mr-3 opacity-70" />
                    <span className="text-sm">Account Settings</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-[#EEEEEE] mx-1 mt-1 mb-1" />
              <DropdownMenuItem 
                onClick={() => navigate('/')}
                className="p-3 focus:bg-red-50 focus:text-red-500 rounded-xl cursor-pointer font-bold text-red-500 transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                <span className="text-sm">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden md:flex w-[280px] border-r border-[#EEEEEE] p-6 flex-col gap-2 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 bg-[#FFFFFF]">
          <div className="mb-8 px-2">
            <span className="text-[11px] font-bold text-[#999] uppercase tracking-[0.1em]">Menu</span>
          </div>
          
          <nav className="flex flex-col gap-1.5">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group
                  ${activeTab === item.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-[#666] hover:bg-[#F8F8F8] hover:text-[#1A1A1A]'}
                `}
              >
                <span className={activeTab === item.id ? 'text-white' : 'text-[#999] group-hover:text-primary transition-colors'}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {role === 'clinic' && (
            <div className="mt-auto pt-6 border-t border-[#F5F5F5]">
              <div className="bg-[#F8F8F8] rounded-2xl p-4 border border-[#EEEEEE]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[12px]">
                    {clinicName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[13px] font-bold text-[#1A1A1A] truncate">{clinicName}</span>
                    <span className="text-[11px] text-[#999]">Administrator</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full py-2 bg-white border border-[#EEEEEE] rounded-lg text-[12px] font-semibold text-[#666] hover:bg-[#EEEEEE] transition-all"
                >
                  Clinic Settings
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-white p-4 md:p-8 animate-in fade-in duration-300 overflow-x-hidden">
          <div className={`${fullWidth ? 'max-w-[1600px]' : 'max-w-[1200px]'} mx-auto`}>
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#EEEEEE] flex items-center justify-around px-6 z-30">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 transition-all
              ${activeTab === item.id ? 'text-primary font-semibold' : 'text-[#999]'}
            `}
          >
            {item.icon}
            <span className="text-[11px] uppercase tracking-wider">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* SETTINGS MODAL */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Clinic Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#666]">Clinic Name</label>
              <input
                value={settingsData.name}
                onChange={(e) => setSettingsData({...settingsData, name: e.target.value})}
                className="px-3 py-2 border border-[#EEEEEE] rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#666]">Phone Number</label>
              <input
                value={settingsData.phone}
                onChange={(e) => setSettingsData({...settingsData, phone: e.target.value})}
                className="px-3 py-2 border border-[#EEEEEE] rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#666]">Address</label>
              <input
                value={settingsData.address}
                onChange={(e) => setSettingsData({...settingsData, address: e.target.value})}
                className="px-3 py-2 border border-[#EEEEEE] rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#666]">Email</label>
              <input
                value={settingsData.email}
                onChange={(e) => setSettingsData({...settingsData, email: e.target.value})}
                className="px-3 py-2 border border-[#EEEEEE] rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
          <DialogFooter>
            <button 
              onClick={async () => {
                try {
                  await updateClinic(settingsData);
                  setIsSettingsOpen(false);
                  toast.success("Clinic settings updated successfully!");
                  } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : "Unknown error";
                    toast.error("Failed to update settings: " + message);
                  }
              }}
              className="w-full h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/95 transition-all"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardLayout;
