import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserPlus, Mail, Key, Stethoscope, User, ChevronDown, Calendar, ChevronLeft } from 'lucide-react';

import { specialties } from '@/lib/mockData';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: specialties[0],
    age: '',
    clinicId: 'none',
    clinicName: 'Independent Practice'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, clinics } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.specialty) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(formData);
      toast.success('Registration successful! Welcome to Clyra.');
      navigate('/doctor/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden p-6 py-12">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="absolute top-8 left-8 z-20 gap-2 text-gray-500 hover:text-teal-600 rounded-xl"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={18} /> Back
      </Button>

      {/* Decorative background elements */}

      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <Card className="w-full max-w-[520px] z-10 border-none shadow-2xl bg-white/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-200">
            <UserPlus className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Join Clyra</CardTitle>
          <CardDescription className="text-gray-500 text-lg">
            Create your doctor profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 px-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  placeholder="Dr. Harsh Polina"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 transition-all rounded-xl shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  type="email"
                  placeholder="name@Clyra.com"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 transition-all rounded-xl shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 px-1">Specialty</label>
                <div className="relative group">
                  <Stethoscope className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  <select
                    className="w-full pl-11 h-12 bg-white border border-gray-100 focus:border-teal-500 transition-all rounded-xl appearance-none outline-none text-sm font-medium pr-8 shadow-sm"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  >
                    {specialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 px-1">Age</label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  <Input
                    type="number"
                    placeholder="30"
                    className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 transition-all rounded-xl shadow-sm"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 px-1">Password</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-white border-gray-100 focus:border-teal-500 transition-all rounded-xl shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 px-1">Select Clinic (Synchronization)</label>
              <div className="relative group">
                <div className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                </div>
                <select
                  className="w-full pl-11 h-12 bg-white border border-gray-100 focus:border-teal-500 transition-all rounded-xl appearance-none outline-none text-sm font-medium pr-8 shadow-sm"
                  value={formData.clinicId}
                  onChange={(e) => {
                    const selectedClinic = clinics.find(c => c.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      clinicId: e.target.value, 
                      clinicName: selectedClinic ? selectedClinic.name : 'Independent Practice' 
                    });
                  }}
                >
                  {clinics.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.location})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-[10px] text-gray-400 px-1 font-medium">Your activity will be mirrored to the selected clinic's management dashboard.</p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-100 transition-all mt-4 active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Profile"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/doctor/login" className="text-teal-600 font-bold hover:underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
      
      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-gray-400 text-sm font-medium">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Secure Server Connected
      </div>
    </div>
  );
};

export default DoctorRegister;
