import { useAppContext } from "@/context/AppContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Bell, Clock, Info, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationsTab = () => {
  const { notifications, markNotificationAsRead, currentDoctor, currentClinic, currentPatient } = useAppContext();
  const navigate = useNavigate();

  // Determine role dynamically
  const role = currentDoctor ? 'doctor' : currentPatient ? 'patient' : 'clinic';

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-[#22C55E]" />;
      case 'warning': return <AlertTriangle size={20} className="text-[#F59E0B]" />;
      default: return <Info size={20} className="text-primary" />;
    }
  };

  return (
    <DashboardLayout activeTab="dashboard" role={role}>
      <div className="flex flex-col gap-8 max-w-[800px] mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#999] hover:text-primary transition-colors w-fit group"
        >
          <div className="w-8 h-8 rounded-full border border-[#EEEEEE] flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="font-semibold">Back</span>
        </button>

        <div>
          <h1 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">Activity Notifications</h1>
          <p className="text-[14px] text-[#999] mt-0.5 font-medium">History of all alerts and status changes relevant to you</p>
        </div>

        <div className="bg-white border border-[#EEEEEE] rounded-[32px] overflow-hidden shadow-sm">
          {notifications.length > 0 ? (
            <div className="divide-y divide-[#F5F5F5]">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-6 hover:bg-[#F8F8F8] transition-all cursor-pointer relative group ${!notif.isRead ? 'bg-primary/5' : ''}`}
                >
                  {!notif.isRead && (
                    <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-primary rounded-r-full shadow-lg shadow-primary/20"></div>
                  )}
                  <div className="flex gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                      ${notif.type === 'success' ? 'bg-[#F0FDF4]' : 
                        notif.type === 'warning' ? 'bg-[#FFFBEB]' : 
                        'bg-primary/5'}
                    `}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-[16px] ${!notif.isRead ? 'font-bold' : 'font-semibold'} text-[#1A1A1A] group-hover:text-primary transition-colors`}>
                          {notif.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#999] font-bold uppercase tracking-wider">
                          <Clock size={12} />
                          {notif.time}
                        </div>
                      </div>
                      <p className="text-[14px] text-[#666] leading-relaxed max-w-[500px]">
                        {notif.description}
                      </p>
                      {!notif.isRead && (
                        <button className="mt-3 text-[11px] font-bold text-primary uppercase tracking-widest hover:underline">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell size={32} className="text-[#CCCCCC]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">Your inbox is empty</h3>
              <p className="text-[#999] text-sm mt-1">We'll notify you when something important happens.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsTab;
