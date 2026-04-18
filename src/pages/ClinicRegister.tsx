import { Plus, ArrowRight, Building2, MapPin, Phone, User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

const ClinicRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminName: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const { registerClinic } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerClinic(formData);
      toast.success("Clinic registered successfully! Welcome aboard.");
      navigate("/clinic/dashboard");
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        toast.error("Network Error: Could not connect to the server (Port 5000). Please ensure the backend is running.");
      } else {
        toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA]">
      {/* LEFT PANEL - BRANDING */}
      <div className="w-full md:w-1/3 bg-primary p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/get-started')}>
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Plus className="w-4 h-4 text-white rotate-45" strokeWidth={3} />
              </button>
              <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">Back</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" strokeWidth={3} />
              </div>
              <span className="text-2xl font-bold tracking-tight">Clyra</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-[36px] font-light leading-tight mb-6">
              Join the future of <br />
              <span className="font-bold">Clinic Management.</span>
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-[280px]">
              Empower your medical staff with the most intuitive CRM designed for modern healthcare.
            </p>
          </div>

          <div className="relative z-10 space-y-6 mt-auto">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-bold">Unify Operations</p>
                <p className="text-[11px] text-white/50">One dashboard for your entire clinic.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="w-full md:w-2/3 p-8 sm:p-12 lg:p-20 flex flex-col justify-center items-center overflow-y-auto">
        <div className="w-full max-w-[580px]">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2">Create Clinic Account</h1>
            <p className="text-[#999] text-[15px]">Fill in the details to establish your digital medical center.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Clinic Name */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[12px] font-bold text-[#666] uppercase tracking-[0.1em]">Clinic / Hospital Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. City Wellness Center"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#666] uppercase tracking-[0.1em]">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="admin@clinic.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#666] uppercase tracking-[0.1em]">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Admin Name */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#666] uppercase tracking-[0.1em]">Admin Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={formData.adminName}
                  onChange={e => setFormData({...formData, adminName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#666] uppercase tracking-[0.1em]">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input 
                  type="tel" 
                  placeholder="+1 (234) 567-890"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[12px] font-bold text-[#666] uppercase tracking-[0.1em]">Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-[#999]" size={18} />
                <textarea 
                  rows={2}
                  placeholder="Street address, city, zip code..."
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#EEEEEE] rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-[60px] bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/95 transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Registering Clinic..." : "Establish Medical Center"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </div>

            <div className="md:col-span-2 text-center mt-6">
              <p className="text-[14px] text-[#999]">
                Already have a clinic account?{" "}
                <button 
                  type="button"
                  onClick={() => navigate("/clinic/login")}
                  className="text-primary font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegister;
