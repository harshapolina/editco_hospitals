import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Play, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowRight,
  User,
  Stethoscope,
  Activity,
  ChevronLeft,
  Calendar,
  TrendingUp,
  History,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DoctorDashboard = () => {
  const { currentDoctor, patients, fetchData, loading, logout, toggleDoctorStatus } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');

  const doctorId = currentDoctor?._id || currentDoctor?.id;

  useEffect(() => {
    if (!currentDoctor) {
      navigate('/doctor/login');
      return;
    }
    fetchData();
  }, [doctorId]); // Stable ID dependency to prevent infinite fetch loop

  if (!currentDoctor || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Filter patients assigned to this doctor (using robust ID matching + normalized name fallback)
  const doctorPatients = patients.filter(p => {
    const doctorId = currentDoctor?._id || currentDoctor?.id;
    const isById = p.assignedDoctorId && p.assignedDoctorId === doctorId;
    
    // Normalize names for comparison (remove "Dr." prefix and lowercase)
    const normalize = (name: string) => name.toLowerCase().replace(/^dr\.?\s*/, '').trim();
    const isByName = p.assignedDoctor && normalize(p.assignedDoctor) === normalize(currentDoctor?.name || "");
    
    return isById || isByName;
  });

  const todayPatients = doctorPatients.filter(p => p.status !== 'completed');
  
  // Recent History Logic (Past OPs)
  const pastPatients = doctorPatients.filter(p => {
    if (p.status !== 'completed') return false;
    
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    if (dateFilter === 'Today') {
      // Show newly completed (current date) or initial mock today data
      return p.lastVisit === todayStr || (p.lastVisit && p.lastVisit.includes('Apr 2024'));
    }
    if (dateFilter === 'Yesterday') return p.lastVisit && p.lastVisit.includes('Mar 2024'); 
    return true; // 'Week' or default shows all
  });

  // Filtering Logic for the main Queue
  const filteredPatients = (statusFilter === 'Completed' ? pastPatients : todayPatients).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (p.token && p.token.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || p.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });


  const stats = [
    { title: "Total OPs Today", value: doctorPatients.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Completed", value: pastPatients.length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "Ongoing", value: doctorPatients.filter(p => p.status === 'consultation').length, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Waiting", value: todayPatients.filter(p => p.status === 'waiting').length, icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Avg Time", value: "12m 40s", icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50" },
  ];


  return (
    <DashboardLayout activeTab="dashboard" role="doctor" fullWidth={true} hideTopNavButtons={false}>
      <div className="flex flex-col gap-8 pb-10 animate-in slide-in-from-right-10 duration-500">
        
        {/* Header Section */}
        <div className="bg-white border border-border p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
          <div className="space-y-4 max-w-[70%]">
            <div className="space-y-1">
              <h1 className="text-[32px] font-black text-[#1A1A1A] tracking-tight leading-none mb-1">Welcome, Dr. {currentDoctor.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg uppercase tracking-wider">{currentDoctor.specialty}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <span className="text-[14px] text-[#666] font-medium flex items-center gap-2">
                    <Calendar size={14} /> {currentDoctor.experience} Years
                  </span>
                </div>
                <div className="hidden sm:block w-[1px] h-4 bg-border mx-1"></div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 text-primary font-black"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                  <span className="text-[10px] font-black text-primary uppercase tracking-tight">Mirroring to: {currentDoctor.clinicName || 'Independent Practice'}</span>
                </div>
              </div>
            </div>

            {/* In-Header Status Toggle */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-[11px] font-black text-[#999] uppercase tracking-[0.2em]">Live Status</span>
              <button 
                onClick={() => toggleDoctorStatus(currentDoctor._id || currentDoctor.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${
                  currentDoctor.status === 'available' ? 'bg-green-50 border-green-100 text-green-600' : 
                  currentDoctor.status === 'busy' ? 'bg-red-50 border-red-100 text-red-600' :
                  'bg-orange-50 border-orange-100 text-orange-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  currentDoctor.status === 'available' ? 'bg-green-500' : 
                  currentDoctor.status === 'busy' ? 'bg-red-500' : 
                  'bg-orange-500 animate-pulse'
                }`} />
                <span className="text-[12px] font-black uppercase tracking-wider">
                  {currentDoctor.status} (Tap to change)
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border border-border shadow-sm hover:shadow-xl transition-all rounded-[28px] bg-white overflow-hidden group">
              <CardContent className="p-7 flex flex-col gap-4">
                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-[#999] text-[13px] font-bold uppercase tracking-widest">{stat.title}</p>
                  <p className="text-[28px] font-black text-[#1A1A1A] tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filters Row */}
        <div className="bg-white border border-border p-6 rounded-[28px] shadow-sm flex flex-col lg:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
            <Input 
              placeholder="Search patient, token, or case details..." 
              className="pl-12 h-14 w-full rounded-2xl border-gray-100 bg-[#F8F8F8]/50 focus:bg-white focus:ring-primary/20 transition-all text-[15px] font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-[#F8F8F8] p-1.5 rounded-2xl border border-border">
              {['All', 'Waiting', 'Ongoing', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${statusFilter === status ? 'bg-white text-primary shadow-sm' : 'text-[#999] hover:text-[#666]'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Today's OP Queue - Full Width Action Area */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-black text-[#1A1A1A] flex items-center gap-3">
              Today's OP Queue
              <Badge className="bg-primary text-white border-none rounded-lg px-2 py-0.5 text-[12px] font-black">
                {filteredPatients.length}
              </Badge>
            </h2>
            <div className="text-[12px] font-bold text-[#999] uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Refreshing in real-time
            </div>
          </div>

          <div className="space-y-4">
            {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
              <Card key={patient._id || patient.id} className="border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group rounded-[28px] overflow-hidden relative bg-white">
                {patient.status === 'consultation' && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 animate-pulse" />
                )}
                <CardContent className="p-7">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#F8F8F8] rounded-2xl flex items-center justify-center border border-border text-primary font-black text-xl shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                        {patient.token || `#${Math.floor(Math.random() * 20) + 1}`}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-[#1A1A1A] text-xl group-hover:text-primary transition-colors leading-none">{patient.name}</h3>
                          <Badge className="bg-gray-50 text-[#666] border-border text-[11px] font-bold py-0.5">{patient.age}Y • {patient.gender === 'F' ? 'Female' : 'Male'}</Badge>
                        </div>
                        <p className="text-[#666] text-[15px] font-medium line-clamp-1 italic">
                          Reason: <span className="text-[#999]">{patient.medicalHistory || "General cross-examination and primary evaluation"}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block space-y-1">
                        <p className="text-[10px] text-[#999] font-black uppercase tracking-[0.2em]">Queue Status</p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${patient.status === 'waiting' ? 'bg-purple-50 border-purple-100 text-purple-600' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${patient.status === 'waiting' ? 'bg-purple-500' : 'bg-orange-500 animate-pulse'}`} />
                          <span className="text-[11px] font-black uppercase tracking-wider">
                            {patient.status}
                          </span>
                        </div>
                      </div>
                      <Button 
                        className={`${patient.status === 'consultation' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-[#1A1A1A] hover:bg-black'} text-white h-14 px-8 rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-95 shadow-lg`}
                        onClick={() => navigate(`/doctor/consultation/${patient._id || patient.id}`)}
                      >
                        {patient.status === 'consultation' ? (
                          <>Resume Observation <Activity size={18} /></>
                        ) : (
                          <>Begin OP <Play size={18} fill="currentColor" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-24 bg-[#F8F8F8]/50 rounded-[40px] border-2 border-dashed border-border border-spacing-4">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-sm border border-border">
                  <Users size={40} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No Patients Found</h3>
                <p className="text-[#999] font-bold">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>

        {/* New 2-Column Section for History and Insights (Vertical After Queue) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Panel 1: Recent History */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[18px] font-black text-[#1A1A1A] flex items-center gap-2">
                <History size={20} className="text-primary" />
                Recent History
              </h3>
              <div className="flex bg-[#F8F8F8] p-1 rounded-xl border border-border">
                {['Today', 'Yesterday', 'Week'].map((date) => (
                  <button
                    key={date}
                    onClick={() => setDateFilter(date)}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${dateFilter === date ? 'bg-white text-primary shadow-sm' : 'text-[#999] hover:text-[#666]'}`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
            <Card className="border border-border shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {pastPatients.slice(0, 5).map((patient) => (
                    <div 
                      key={patient._id || patient.id} 
                      className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group" 
                      onClick={() => navigate(`/clinic/patient/${patient._id || patient.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F8F8F8] text-primary rounded-2xl flex items-center justify-center border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                          <CheckCircle size={20} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black text-[15px] text-[#1A1A1A] tracking-tight">{patient.name}</p>
                          <p className="text-[11px] text-[#999] font-bold uppercase tracking-widest">{patient.lastVisit}</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  {pastPatients.length === 0 && (
                    <div className="py-12 px-6 text-center text-[#BBB] text-sm font-bold italic">
                      No finalized medical records for today.
                    </div>
                  )}
                </div>
              </CardContent>
              {pastPatients.length > 5 && (
                <Button variant="ghost" className="w-full h-14 text-primary font-black text-[13px] uppercase tracking-widest hover:bg-primary/5 rounded-none border-t border-border transition-colors">
                  View Full Clinical History
                </Button>
              )}
            </Card>
          </section>

          {/* Panel 2: Quick Insights */}
          <section className="space-y-6">
            <h3 className="text-[18px] font-black text-[#1A1A1A] flex items-center gap-2 px-2">
              <TrendingUp size={20} className="text-primary" />
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Handled Today", value: pastPatients.length, unit: "Patients", icon: Users, color: "text-blue-500" },
                { label: "Completion Rate", value: "94", unit: "% Performance", icon: Activity, color: "text-green-500" },
                { label: "Peak Performance", value: "10AM", unit: "Peak Hour", icon: Clock, color: "text-orange-500" }
              ].map((insight, idx) => (
                <div key={idx} className="bg-white border border-border p-6 rounded-[28px] shadow-sm flex items-center gap-5 hover:border-primary/10 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${insight.color} border border-border`}>
                    <insight.icon size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-[#999] uppercase tracking-widest leading-none">{insight.label}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter leading-none">{insight.value}</span>
                      <span className="text-[10px] font-bold text-[#AAA]">{insight.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
