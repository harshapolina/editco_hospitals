import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, Key, Mail, Stethoscope, ChevronLeft } from 'lucide-react';


const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email, password });
      toast.success('Welcome back, Doctor!');
      navigate('/doctor/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="absolute top-8 left-8 z-20 gap-2 text-gray-500 hover:text-teal-600 rounded-xl"
        onClick={() => navigate('/get-started')}
      >
        <ChevronLeft size={18} /> Back
      </Button>

      {/* Decorative background elements */}

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <Card className="w-full max-w-[420px] z-10 border-none shadow-2xl bg-white/80 backdrop-blur-xl transition-all duration-500 hover:shadow-teal-100/50">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-200 animate-in fade-in zoom-in duration-700">
            <Stethoscope className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Doctor Portal</CardTitle>
          <CardDescription className="text-gray-500 text-lg">
            Login to manage your consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  type="email"
                  placeholder="name@Clyra.com"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 transition-all rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative group">
                <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 transition-all rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                Remember me
              </label>
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Forgot password?</a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-teal-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In <LogIn className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <p className="text-center text-sm text-gray-600">
            New to Clyra? <Link to="/doctor/register" className="text-teal-600 font-bold hover:underline">Register here</Link>
          </p>
          <div className="text-center w-full relative">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative z-10 bg-white px-3 text-xs uppercase text-gray-400 font-medium">Clyra v2.0</span>
          </div>
          <p className="text-center text-sm text-gray-500">
            For emergencies, contact clinical support
          </p>
        </CardFooter>
      </Card>
      
      {/* Bottom right versioning or branding */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-gray-400 text-sm font-medium">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Systems Operational
      </div>
    </div>
  );
};

export default DoctorLogin;
