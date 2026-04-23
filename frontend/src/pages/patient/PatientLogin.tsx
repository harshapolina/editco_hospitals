import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Mail, Key, ChevronLeft, Award } from 'lucide-react';

const PatientLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginPatient } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await loginPatient(formData);
      toast.success('Welcome back to Clyra!');
      navigate('/patient/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-3xl opacity-50" />

      <Button 
        variant="ghost" 
        className="absolute top-8 left-8 z-20 gap-2 text-gray-500 hover:text-teal-600 rounded-xl"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={18} /> Back
      </Button>

      <Card className="w-full max-w-[440px] z-10 border-none shadow-2xl bg-white/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-100">
            <Award className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Patient Portal</CardTitle>
          <CardDescription className="text-gray-500 font-medium tracking-wide">
            Access your health records and book appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-600">Password</label>
                <Link to="#" className="text-xs font-bold text-teal-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-100 mt-2 active:scale-95 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Connecting...
                </div>
              ) : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <p className="text-center text-sm text-gray-500">
            First time using the portal? <Link to="/patient/register" className="text-teal-600 font-bold hover:underline">Register your account</Link>
          </p>
        </CardFooter>
      </Card>
      
      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-gray-400 text-sm font-bold">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Secure Health Server
      </div>
    </div>
  );
};

export default PatientLogin;
