import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { PatientRegisterPayload } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Mail, Key, ChevronLeft, Award, Calendar, Phone } from 'lucide-react';

const PatientRegister = () => {
  const [formData, setFormData] = useState<PatientRegisterPayload>({
    name: '',
    email: '',
    password: '',
    age: 30,
    gender: 'M',
    phone: '',
    bloodGroup: 'O+'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerPatient } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await registerPatient(formData);
      toast.success('Registration successful! Welcome to Clyra.');
      navigate('/patient/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-6 relative overflow-hidden py-12">
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

      <Card className="w-full max-w-[500px] z-10 border-none shadow-2xl bg-white/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
        <CardHeader className="space-y-1 text-center pb-8 border-b border-gray-50">
          <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-100">
            <User size={32} className="text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Create Account</CardTitle>
          <CardDescription className="text-gray-500 font-medium tracking-wide">
            Join thousands of patients managing their health smarter
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 px-1">Full Name</label>
              <Input
                placeholder="John Doe"
                className="h-12 bg-white border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 px-1">Email</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="h-12 bg-white border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 px-1">Phone</label>
                <Input
                  placeholder="+1 234 567 890"
                  className="h-12 bg-white border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 px-1">Age</label>
                <Input
                  type="number"
                  placeholder="30"
                  className="h-12 bg-white border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 px-1">Gender</label>
                <select 
                  className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium outline-none"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 px-1">Blood</label>
                <select 
                  className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium outline-none"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 px-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 bg-white border-gray-100 focus:border-teal-500 rounded-xl shadow-sm font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-100 mt-4 active:scale-95 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Join TeleCare"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <p className="text-center text-sm text-gray-500 font-medium">
             Already have an account? <Link to="/patient/login" className="text-teal-600 font-bold hover:underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientRegister;
