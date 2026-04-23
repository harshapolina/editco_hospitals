import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, MapPin, Phone, User, Mail, Lock, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const ClinicRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminName: "",
    phone: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerClinic } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerClinic(formData);
      toast.success("Clinic registered successfully! Welcome aboard.");
      navigate("/clinic/dashboard");
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        toast.error("Network Error: Could not connect to the server. Please ensure the backend is running.");
      } else {
        toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden py-12">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="absolute top-8 left-8 z-20 gap-2 text-gray-500 hover:text-primary rounded-xl"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={18} /> Back
      </Button>

      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <Card className="w-full max-w-[650px] z-10 border-none shadow-2xl bg-white/90 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Register Medical Center</CardTitle>
          <CardDescription className="text-gray-500 text-lg">
            Empower your clinic with modern digital infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Clinic Identity</label>
              <div className="relative group">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Clinic / Hospital Name"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-primary transition-all rounded-xl"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Access</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="admin@clinic.com"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-primary transition-all rounded-xl"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Security</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="Set Password"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-primary transition-all rounded-xl"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Administrator</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Admin Full Name"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-primary transition-all rounded-xl"
                  value={formData.adminName}
                  onChange={e => setFormData({...formData, adminName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-primary transition-all rounded-xl"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location Details</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <textarea
                  placeholder="Full Office Address"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 focus:border-primary focus:ring-0 outline-none transition-all rounded-xl min-h-[80px] text-sm resize-none"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="md:col-span-2 w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Building Workspace...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Establish Medical Center <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <p className="text-center text-sm text-gray-600">
            Already managing a clinic? <Link to="/clinic/login" className="text-primary font-bold hover:underline">Log in here</Link>
          </p>
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-50 w-full opacity-60">
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <ShieldCheck size={14} className="text-green-500" /> HIPAA Compliant
             </div>
             <div className="w-1 h-1 bg-gray-200 rounded-full" />
             <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Encrypted Database
             </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* systems status */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-gray-400 text-sm font-medium">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Systems Operational
      </div>
    </div>
  );
};

export default ClinicRegister;
