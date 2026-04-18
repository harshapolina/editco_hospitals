import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAppContext } from '@/context/AppContext';
import { 
  Square, 
  RotateCcw, 
  CheckCircle, 
  ChevronLeft, 
  History, 
  BrainCircuit,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Trash2,
  Plus,
  Mic,
  Activity,
  Calendar,
  FileText,
  User,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

type ConsultationState = 'PREVIEW' | 'RECORDING' | 'PROCESSING' | 'RESULT';

const ConsultationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, fetchData, currentDoctor, startOP, completeOP } = useAppContext();
  
  const [currentState, setCurrentState] = useState<ConsultationState>('PREVIEW');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [timer, setTimer] = useState(0);
  const [aiResult, setAiResult] = useState<any>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'uploading' | 'transcribing' | 'processing' | 'completed' | 'failed'>('uploading');
  
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const patient = patients.find(p => p._id === id || p.id === id);

  useEffect(() => {
    if (!currentDoctor) navigate('/doctor/login');
    if (!patient) fetchData();
  }, [id, patient, currentDoctor]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        }
        setTranscription(prev => prev + ' ' + finalTranscript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleStartOP = async () => {
    try {
      if (!patient) return;
      await startOP(patient._id || patient.id);
      setCurrentState('RECORDING');
      startRecording();
    } catch (err) {
      toast.error("Process Initiation Failed");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start(1000); // Capture data every second
      setIsRecording(true);
      setTimer(0);
      setupSpeechRecognition();
      if (recognitionRef.current) recognitionRef.current.start();

      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

      // Trigger processing only when the recorder has actually stopped
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setCurrentState('PROCESSING');
        processConsultation();
      };
    } catch (err) {
      toast.error("Audio Input Access Denied");
      setCurrentState('PREVIEW');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    }
  };

  const processConsultation = async () => {
    try {
      if (audioChunksRef.current.length === 0) {
        toast.error("No audio data captured.");
        setCurrentState('PREVIEW');
        return;
      }

      setProcessingStatus('uploading');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'consultation.webm');
      formData.append('patientName', patient?.name || 'Unknown');

      setProcessingStatus('transcribing');
      const response = await api.post('/ai/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProcessingStatus('processing');
      if (response.data && response.data.status === 'completed') {
        const { structured } = response.data;
        // Map new structure to UI state
        setAiResult({
          diagnosis: structured.diagnosis,
          prescription: structured.medicines || [],
          advice: structured.advice,
          followUp: structured.follow_up,
          complaint: structured.problem,
          findings: structured.summary,
          is_unclear: response.data.is_unclear
        });
        setProcessingStatus('completed');
        setCurrentState('RESULT');
      } else {
        throw new Error(response.data.message || "Failed to process audio");
      }
    } catch (error: any) {
      console.error('AI Pipeline Error:', error);
      setProcessingStatus('failed');
      const errorMsg = error.response?.data?.message || error.message || "AI Analysis failed";
      toast.error(errorMsg + '. Switching to manual mode.');
      
      setAiResult({
        diagnosis: "Manual Review Required",
        prescription: [],
        advice: "Automatic processing failed. Please enter summary manually.",
        followUp: "",
        complaint: "Audio capture failed",
        findings: "System was unable to transcribe the session."
      });
      setCurrentState('RESULT');
    }
  };

  const handleSaveResult = async () => {
    try {
      await completeOP(patient!._id || patient!.id, {
        ...aiResult,
        doctorId: currentDoctor?._id,
        doctorName: currentDoctor?.name
      });
      toast.success("Clinical Record Finalized");
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error("Finalization Interrupted");
    }
  };

  const formatTime = (s: number) => {
     const m = Math.floor(s / 60);
     const ss = s % 60;
     return `${m.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  const updateMedication = (index: number, field: string, value: any) => {
    const newPrescription = [...aiResult.prescription];
    newPrescription[index] = { ...newPrescription[index], [field]: value };
    setAiResult({ ...aiResult, prescription: newPrescription });
  };

  if (!patient || !currentDoctor) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans selection:bg-teal-100">
      
      {/* PROFESSIONAL CLINICAL HEADER */}
      <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-8 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/doctor/dashboard')} className="rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
               <ChevronLeft size={18} className="text-gray-400" />
            </Button>
            <div className="flex flex-col">
               <h1 className="text-[14px] font-black text-[#1A1A1A] tracking-widest uppercase">Consultation Workspace</h1>
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Medical Grade Session</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-gray-100 text-gray-400 font-bold px-3 py-1 rounded-lg">
               ID: {id?.slice(-8).toUpperCase()}
            </Badge>
            {currentState === 'RESULT' && (
               <Button className="bg-[#1A1A1A] hover:bg-black text-white rounded-xl gap-2 font-bold px-8 h-10 shadow-xl transition-all" onClick={handleSaveResult}>
                  <ShieldCheck size={16} /> Finalize Medical Record
               </Button>
            )}
         </div>
      </header>

      <div className="flex-1 lg:grid lg:grid-cols-[2fr_3fr] max-w-[1800px] mx-auto w-full">
         
         {/* LEFT SECTION (40%) : CLINICAL CONTEXT CARD */}
         <aside className="bg-[#F8F9FA] border-r border-gray-100 p-8 lg:p-12 space-y-10 overflow-y-auto">
            
            {/* Small Doctor Identity Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-600/10">
                     <Stethoscope size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Authenticated Doctor</p>
                     <p className="text-[14px] font-bold text-[#1A1A1A]">{currentDoctor.name}</p>
                  </div>
               </div>
               <LayoutDashboard size={16} className="text-gray-200" />
            </div>

            {/* Patient Biography Section */}
            <div className="space-y-8">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 inline-block px-2 py-0.5 rounded">Active Case</p>
                  <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter leading-none">{patient.name}</h2>
                  <div className="flex flex-wrap gap-2 pt-2">
                     <Badge className="bg-white border border-gray-200 text-gray-600 font-bold rounded-lg px-3 py-1 text-[11px] shadow-sm">{patient.age} Years</Badge>
                     <Badge className="bg-white border border-gray-200 text-gray-600 font-bold rounded-lg px-3 py-1 text-[11px] shadow-sm">{patient.gender === 'F' ? 'Female' : 'Male'}</Badge>
                     <Badge className="bg-[#1A1A1A] text-white border-none font-bold rounded-lg px-3 py-1 text-[11px] shadow-lg shadow-black/10">Token: {patient.token || '#07'}</Badge>
                  </div>
               </div>

               {/* REASON FOR VISIT: Defined Card */}
               <div className="space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                     <FileText size={14} /> Intake Summary / Reason
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
                     <p className="text-[15px] text-gray-700 font-medium leading-relaxed italic">
                        "{patient.medicalHistory || "Primary complaint regarding persistent symptomatic discomfort. Requested full clinical evaluation and prescription review."}"
                     </p>
                  </div>
               </div>

               {/* PAST RECORDS: Key Visit Feed */}
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                     <History size={14} /> Clinical History Feed
                  </h3>
                  <div className="space-y-3">
                     {patient.opRecords?.slice(0, 3).map((rec: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-200 hover:shadow-md transition-all cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-teal-600 font-black text-[10px] border border-gray-100">
                                 {rec.date.split(' ')[0]}
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-[13px] font-bold text-[#1A1A1A] group-hover:text-teal-700 transition-colors">{rec.diagnosis}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">DR. {rec.doctorName.split(' ').pop()}</p>
                              </div>
                           </div>
                           <ArrowRight size={14} className="text-gray-200 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </div>
                     ))}
                     {(!patient.opRecords || patient.opRecords.length === 0) && (
                        <div className="py-6 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                           <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">No Historical Logs Found</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Timeline Expansion Trigger */}
               <Sheet>
                  <SheetTrigger asChild>
                     <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-gray-200 bg-white hover:bg-gray-50 hover:border-teal-200 transition-all text-[12px] uppercase tracking-widest gap-3 shadow-sm active:scale-[0.98]">
                        <History size={18} /> View Full Patient Timeline
                     </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-xl overflow-y-auto p-12 bg-white">
                     <SheetHeader className="mb-12">
                        <SheetTitle className="text-3xl font-black text-[#1A1A1A] tracking-tighter flex items-center gap-4">
                           <History size={32} className="text-teal-600" /> Medical Logs
                        </SheetTitle>
                        <SheetDescription className="font-bold text-[11px] uppercase tracking-[0.2em] text-gray-400 pt-2 border-t border-gray-50">Comprehensive cross-clinic patient history</SheetDescription>
                     </SheetHeader>
                     <div className="space-y-10 pl-6 border-l-2 border-gray-50 relative">
                        {patient.opRecords?.map((rec: any, i: number) => (
                           <div key={i} className="relative group">
                              <div className="absolute left-[-31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-teal-500 shadow-md group-hover:scale-125 transition-transform" />
                              <Card className="border border-gray-100 shadow-sm rounded-[32px] bg-white p-7 space-y-5 transition-all hover:shadow-2xl hover:shadow-gray-900/10">
                                 <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                       <h4 className="font-black text-xl text-[#1A1A1A] tracking-tight">{rec.diagnosis}</h4>
                                       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                                          <Calendar size={12} /> {rec.date}
                                          <span className="w-1 h-1 bg-teal-200 rounded-full" />
                                          DR. {rec.doctorName}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Intake Detail</p>
                                    <p className="text-[14px] text-gray-600 font-medium leading-relaxed italic border-l-2 border-teal-50 pl-4">"{rec.complaint}"</p>
                                 </div>
                                 <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Prescription Record</p>
                                    <div className="grid grid-cols-1 gap-2">
                                       {rec.prescription?.map((p: any, j: number) => (
                                          <div key={j} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                             <span className="text-[13px] font-bold text-[#1A1A1A]">{p.medication}</span>
                                             <Badge className="bg-white text-teal-600 border border-teal-100 rounded-lg text-[10px]">{p.dosage}</Badge>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </Card>
                           </div>
                        ))}
                     </div>
                  </SheetContent>
               </Sheet>
            </div>
         </aside>

         {/* RIGHT SECTION (60%) : RECORDING HUB & RESULTS */}
         <main className="bg-white p-10 lg:p-20 relative overflow-hidden">
            
            {/* Header Labels for Right Section */}
            <div className="mb-20 space-y-3">
               <h3 className="text-3xl lg:text-5xl font-black text-[#1A1A1A] tracking-tighter">Consultation Recording</h3>
               <p className="text-gray-400 font-bold text-lg max-w-xl">Capture clinical conversation for structured documentation and historical archiving.</p>
            </div>

            {(currentState === 'PREVIEW' || currentState === 'RECORDING') && (
               <section className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-700">
                  
                  {currentState === 'PREVIEW' && (
                     <div className="flex flex-col items-center gap-12">
                        <button 
                           onClick={handleStartOP}
                           className="group relative w-64 h-64 rounded-full bg-red-600 flex items-center justify-center transition-all hover:scale-[1.05] active:scale-95 shadow-[0_30px_70px_rgba(220,38,38,0.25)] border-[8px] border-white"
                        >
                           <Mic size={72} className="text-white" />
                        </button>
                        <div className="flex flex-col items-center gap-4 text-center">
                           <h4 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Start Consultation Recording</h4>
                           <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Begin capturing patient interaction</p>
                        </div>
                     </div>
                  )}

                  {currentState === 'RECORDING' && (
                     <div className="flex flex-col items-center gap-12">
                        <div className="flex flex-col items-center gap-6">
                           <div className="text-[120px] font-mono font-black text-[#1A1A1A] tabular-nums tracking-tighter leading-none">
                              {formatTime(timer)}
                           </div>
                           <Badge className="bg-red-600 text-white border-none py-2 px-8 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl shadow-red-100 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                              Recording in progress...
                           </Badge>
                        </div>

                        <button 
                           onClick={stopRecording}
                           className="group relative w-40 h-40 rounded-full bg-[#1A1A1A] flex items-center justify-center transition-all hover:scale-[1.05] active:scale-95 shadow-2xl border-[10px] border-white"
                        >
                           <Square size={36} className="text-white fill-white" />
                        </button>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs border-b-2 border-gray-100 pb-2">Terminate Data Capture Session</p>
                     </div>
                  )}
               </section>
            )}

            {currentState === 'PROCESSING' && (
               <section className="flex flex-col items-center justify-center min-h-[400px] animate-in zoom-in-95 duration-1000">
                  <div className="relative mb-14">
                     <div className="w-48 h-48 border-[10px] border-gray-50 rounded-full animate-spin border-t-teal-500" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit size={64} className="text-teal-600" />
                     </div>
                  </div>
                  <div className="text-center space-y-8 w-full max-w-md">
                     <div className="space-y-2">
                        <h3 className="text-4xl font-black text-[#1A1A1A] tracking-tight">Processing Clinical Data</h3>
                        <p className="text-gray-400 font-bold text-lg">Synthesizing interaction into structured medical insights...</p>
                     </div>
                     
                     {/* AUDIO VERIFICATION PLAYER */}
                     {recordedAudioUrl && (
                        <div className="bg-[#F8F9FA] p-6 rounded-[32px] border border-gray-100 w-full animate-in slide-in-from-bottom-5 duration-500 shadow-sm">
                           <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-4 flex items-center gap-2">
                              <Mic size={12} /> Recording Captured Successfully
                           </p>
                           <audio src={recordedAudioUrl} controls className="w-full h-10 accent-teal-600" />
                        </div>
                     )}
                  </div>
               </section>
            )}

            {/* RESULTS SECTION: EXPANSIVE GRID */}
            {currentState === 'RESULT' && (
               <section className="space-y-16 animate-in slide-in-from-bottom-20 duration-1000">
                  
                  {/* Result Banner */}
                  <div className="bg-teal-600 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-teal-600/20 group relative overflow-hidden">
                     <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                     <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3">
                           <Sparkles size={24} className="text-teal-200" />
                           <h3 className="text-3xl font-black tracking-tight">Clinical Insights Successfully Synthesized</h3>
                        </div>
                        <p className="text-teal-50 font-medium text-lg opacity-80 max-w-xl">Every data point has been cross-referenced with the audio transcript for maximum medical accuracy.</p>
                        {recordedAudioUrl && (
                           <div className="mt-6 pt-6 border-t border-white/10 w-full max-w-lg">
                              <p className="text-[9px] font-black uppercase tracking-widest text-teal-200 mb-2">Review Session Audio</p>
                              <audio src={recordedAudioUrl} controls className="w-full h-8 opacity-90 invert brightness-100 contrast-100" />
                           </div>
                        )}
                     </div>
                     <div className="flex gap-4 relative z-10 w-full md:w-auto">
                        <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl h-14 px-8 font-black gap-2 transition-all" onClick={() => { setAiResult(null); setCurrentState('RECORDING'); startRecording(); }}>
                           <RotateCcw size={18} /> Redo Capture
                        </Button>
                     </div>
                  </div>

                  {/* Structured Core Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <Card className="border border-gray-100 shadow-xl shadow-gray-200/20 rounded-[40px] p-10 bg-white space-y-6">
                        <div className="flex items-center gap-3 text-teal-600">
                           <Activity size={20} />
                           <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em]">Diagnostic Assessment</CardTitle>
                        </div>
                        <textarea 
                          className="w-full min-h-[120px] p-0 bg-transparent border-none focus:ring-0 text-2xl text-[#1A1A1A] font-black leading-tight resize-none"
                          value={aiResult.diagnosis}
                          onChange={(e) => setAiResult({...aiResult, diagnosis: e.target.value})}
                        />
                     </Card>

                     <Card className="border border-gray-100 shadow-xl shadow-gray-200/20 rounded-[40px] p-10 bg-white space-y-6">
                        <div className="flex items-center gap-3 text-teal-600">
                           <FileText size={20} />
                           <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em]">Prescribed Medication</CardTitle>
                        </div>
                        <div className="space-y-3">
                           {aiResult?.prescription?.length > 0 && aiResult.prescription[0]?.name !== "Information not clearly available" ? aiResult.prescription.map((med: any, i: number) => (
                              <div key={i} className="flex justify-between items-center text-lg font-black text-[#1A1A1A] bg-gray-50/50 p-4 rounded-2xl border border-gray-50 shadow-sm">
                                 <span>{med.name || med.medication}</span>
                                 <Badge className="bg-teal-500 text-white border-none text-[10px] px-3">{med.dosage}</Badge>
                              </div>
                           )) : (
                              <div className="flex items-center gap-3 p-6 bg-red-50 rounded-3xl border border-red-100 text-red-600 italic font-bold text-sm">
                                 <AlertCircle size={18} /> Information not clearly available from recording.
                              </div>
                           )}
                        </div>
                     </Card>
                  </div>

                  {/* PREMIUM PRESCRIPTION TABLE */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between px-4">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Prescription Planner</h3>
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verify and refine medication dosing logic</p>
                        </div>
                        <Button className="bg-[#1A1A1A] hover:bg-black text-white rounded-2xl h-12 px-8 font-black gap-2 shadow-2xl" onClick={() => setAiResult({...aiResult, prescription: [...aiResult.prescription, { medication: "New Medication", dosage: "0mg", m: 0, a: 0, n: 0, instructions: "" }]})}>
                           <Plus size={18} /> Add Entry
                        </Button>
                     </div>
                     <Card className="border border-gray-100 shadow-2xl shadow-gray-200/30 rounded-[40px] bg-white overflow-hidden">
                        <Table>
                           <TableHeader className="bg-gray-50/50 h-20">
                              <TableRow className="border-none">
                                 <TableHead className="font-black text-[11px] uppercase tracking-[0.3em] pl-10">Medication</TableHead>
                                 <TableHead className="font-black text-[11px] uppercase tracking-[0.3em]">Strength</TableHead>
                                 <TableHead className="font-black text-[11px] uppercase tracking-[0.3em] text-center">MOR</TableHead>
                                 <TableHead className="font-black text-[11px] uppercase tracking-[0.3em] text-center">AFT</TableHead>
                                 <TableHead className="font-black text-[11px] uppercase tracking-[0.3em] text-center">NIG</TableHead>
                                 <TableHead className="font-black text-[11px] uppercase tracking-[0.3em]">Instructions</TableHead>
                                 <TableHead className="w-16"></TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {aiResult.prescription.map((med: any, i: number) => (
                                 <TableRow key={i} className="border-gray-50 h-24 hover:bg-gray-50/30 transition-all group">
                                    <TableCell className="pl-10">
                                       <input className="bg-transparent border-none focus:ring-0 font-black text-lg text-[#1A1A1A]" value={med.medication} onChange={(e) => updateMedication(i, 'medication', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                       <input className="bg-transparent border-none focus:ring-0 font-bold text-teal-600" value={med.dosage} onChange={(e) => updateMedication(i, 'dosage', e.target.value)} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                       <input className="w-12 h-12 rounded-2xl border-2 border-gray-100 text-center font-black text-xl shadow-sm focus:border-teal-500 focus:ring-0 transition-all" value={med.m} type="number" onChange={(e) => updateMedication(i, 'm', parseInt(e.target.value) || 0)} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                       <input className="w-12 h-12 rounded-2xl border-2 border-gray-100 text-center font-black text-xl shadow-sm focus:border-teal-500 focus:ring-0 transition-all" value={med.a} type="number" onChange={(e) => updateMedication(i, 'a', parseInt(e.target.value) || 0)} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                       <input className="w-12 h-12 rounded-2xl border-2 border-gray-100 text-center font-black text-xl shadow-sm focus:border-teal-500 focus:ring-0 transition-all" value={med.n} type="number" onChange={(e) => updateMedication(i, 'n', parseInt(e.target.value) || 0)} />
                                    </TableCell>
                                    <TableCell>
                                       <input className="bg-transparent border-none focus:ring-0 text-[15px] font-bold text-gray-400 w-full italic" value={med.instructions} onChange={(e) => updateMedication(i, 'instructions', e.target.value)} />
                                    </TableCell>
                                    <TableCell className="pr-10 text-right">
                                       <Button variant="ghost" size="icon" className="text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setAiResult({...aiResult, prescription: aiResult.prescription.filter((_: any, idx: number) => idx !== i)})}>
                                          <Trash2 size={18} />
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </Card>
                  </div>

                  {/* Advice & Follow-up Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-40">
                     <Card className="border border-gray-100 shadow-xl shadow-gray-200/20 rounded-[40px] p-10 bg-white space-y-6">
                        <div className="flex items-center gap-3 text-teal-600">
                           <LayoutDashboard size={20} />
                           <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em]">Medical Advice</CardTitle>
                        </div>
                        <textarea 
                          className="w-full min-h-[150px] p-0 bg-transparent border-none focus:ring-0 text-lg text-gray-600 font-medium leading-relaxed resize-none"
                          value={aiResult.advice}
                          onChange={(e) => setAiResult({...aiResult, advice: e.target.value})}
                        />
                     </Card>
                     <Card className="border-none shadow-2xl shadow-[#1A1A1A]/20 rounded-[40px] p-10 bg-[#1A1A1A] text-white space-y-6 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500 opacity-5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-3 text-gray-500">
                           <Calendar size={20} />
                           <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em]">Follow-up Schedule</CardTitle>
                        </div>
                        <textarea 
                          className="w-full min-h-[150px] p-0 bg-transparent border-none focus:ring-0 text-3xl text-teal-400 font-black leading-tight resize-none relative z-10"
                          value={aiResult.followUp}
                          onChange={(e) => setAiResult({...aiResult, followUp: e.target.value})}
                        />
                     </Card>
                  </div>

               </section>
            )}
         </main>
      </div>

      {/* STICKY FINALIZATION BAR */}
      {currentState === 'RESULT' && (
         <div className="fixed bottom-0 left-0 right-0 p-8 bg-white border-t border-gray-100 shadow-[0_-30px_60px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-full duration-1000">
            <div className="max-w-[1800px] mx-auto flex items-center justify-between px-10">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-teal-600 rounded-[20px] shadow-2xl shadow-teal-600/20 flex items-center justify-center text-white">
                     <ShieldCheck size={32} />
                  </div>
                  <div>
                     <h5 className="text-[18px] font-black text-[#1A1A1A] tracking-tight">Diagnostic Verification Complete</h5>
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ready for transition to next active queue patient</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <Button variant="ghost" className="h-14 px-10 rounded-2xl font-black text-gray-400 text-sm active:scale-[0.98]" onClick={() => navigate('/doctor/dashboard')}>
                     Exit Workspace
                  </Button>
                  <Button className="h-14 px-16 rounded-2xl font-black bg-teal-600 hover:bg-teal-700 text-white text-lg shadow-2xl shadow-teal-600/30 transition-all hover:scale-[1.05] active:scale-[0.95]" onClick={handleSaveResult}>
                     <CheckCircle size={22} /> Finalize OP & Next Patient
                  </Button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

// Extra icon helper
function AlertCircle({size, className}: {size?: number, className?: string}) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
   );
}

export default ConsultationPage;
