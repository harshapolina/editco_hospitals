import { Plus, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

import { toast } from "sonner";

const ClinicLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginClinic } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginClinic({ email, password });
      toast.success("Welcome back to your Medical Center!");
      navigate("/clinic/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/2 bg-primary p-12 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Logo & Back */}
        <div className="flex items-center justify-between mb-20 relative z-10">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate(-1)}>
             <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
               <Plus className="w-4 h-4 text-white rotate-45" strokeWidth={3} />
             </button>
             <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">Back</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary" strokeWidth={3} />
            </div>
            <span className="text-xl font-semibold">Clyra</span>
          </div>
        </div>


        {/* Brand Message */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-[32px] sm:text-[40px] leading-tight font-light mb-6">
            Streamline your clinic.<br />
            Manage smarter.
          </h2>
          <p className="text-[14px] text-white/70 leading-relaxed mb-12">
            Everything your clinic needs — doctors, patients, and records — all in one place.
          </p>

          {/* Stat Chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "10k+ Doctors" },
              { label: "50k+ Patients" },
              { label: "24/7 Support" }
            ].map((stat, i) => (
              <div 
                key={i}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[12px] font-medium backdrop-blur-sm"
              >
                {stat.label}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circle backdrop */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <h1 className="text-[28px] font-normal text-[#1A1A1A] mb-2">Welcome back 👋</h1>
            <p className="text-[14px] text-[#999]">Log in to your clinic account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#999] uppercase tracking-wider">
                Email address
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinic@example.com"
                className="w-full py-3 bg-transparent border-b-2 border-[#EEEEEE] focus:border-primary outline-none text-[15px] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1 relative">
              <label className="text-[12px] font-medium text-[#999] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3 bg-transparent border-b-2 border-[#EEEEEE] focus:border-primary outline-none text-[15px] transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#999] hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <button type="button" className="text-[13px] text-[#999] hover:text-primary transition-colors font-medium">
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-primary text-white rounded-full flex items-center justify-center gap-2 text-[15px] font-semibold hover:bg-primary/95 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Log In"} {!loading && <ArrowRight size={18} />}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-[#EEEEEE]"></div>
                <span className="flex-shrink mx-4 text-[12px] text-[#999] font-medium uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-[#EEEEEE]"></div>
              </div>

              <button 
                type="button"
                onClick={() => navigate("/clinic/register")}
                className="w-full h-[52px] bg-transparent border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] rounded-full text-[15px] font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                Create Clinic Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicLogin;
