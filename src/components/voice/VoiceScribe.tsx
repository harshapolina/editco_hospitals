import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, CheckCircle2, AlertCircle, RefreshCcw, Clipboard, Plus, Trash2, Check, Clock, Info, User, Languages, FileText, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Medicine {
  name: string;
  strength: string;
  timing: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  instructions: string;
}

interface AIResult {
  full_narrative: string;
  summary: string;
  problem: string;
  diagnosis: string;
  prescription: string;
  medicines: Medicine[];
  advice: string;
  follow_up: string;
}

const VoiceScribe: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<"transcribing" | "synthesizing">("transcribing");
  const [result, setResult] = useState<AIResult | null>(null);
  const [rawTranscript, setRawTranscript] = useState<string | null>(null);
  const [localMedicines, setLocalMedicines] = useState<Medicine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Form state for manual entry
  const [newMed, setNewMed] = useState<Medicine>({
    name: "",
    strength: "",
    timing: { morning: false, afternoon: false, night: false },
    instructions: "",
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setTimer(0);
      setResult(null);
      setRawTranscript(null);
      setRecordedAudioUrl(null);
      timerIntervalRef.current = window.setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setProcessingStep("transcribing");
    setResult(null);
    setLocalMedicines([]);
    setRawTranscript(null);
    setError(null);

    const formData = new FormData();
    formData.append("audio", blob, "consultation.webm");

    try {
      setTimeout(() => setProcessingStep("synthesizing"), 2500);

      const response = await api.post("/ai/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "completed") {
        setRawTranscript(response.data.transcript);
        const aiResult = response.data.structured as AIResult;
        setResult(aiResult);
        const filteredMedicines = (aiResult.medicines || []).filter(m => m.name && m.name.trim().length > 0);
        setLocalMedicines(filteredMedicines);
      } else {
        setError(response.data.message || "Processing failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect to AI server");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAdd = () => {
    if (!newMed.name) return;
    setLocalMedicines([...localMedicines, newMed]);
    setNewMed({ name: "", strength: "", timing: { morning: false, afternoon: false, night: false }, instructions: "" });
    setIsAddModalOpen(false);
  };

  const removeMed = (index: number) => {
    setLocalMedicines(localMedicines.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm overflow-hidden relative min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight text-gradient">Clinical AI Scribe</h2>
          <p className="text-[15px] text-[#999] mt-1 font-medium italic">High-fidelity transcription with cross-language support</p>
        </div>
        {!isProcessing && !result && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isRecording ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">{isRecording ? 'Capturing Audio' : 'Engine Ready'}</span>
            </div>
        )}
      </div>

      {!result && !isProcessing && (
        <div className="flex flex-col items-center justify-center py-16">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isRecording ? "bg-red-500 animate-pulse scale-110" : "bg-primary hover:bg-primary-dark hover:scale-105"}`}
          >
            {isRecording ? <Square className="text-white fill-current" size={36} /> : <Mic className="text-white" size={42} />}
          </button>
          <div className="mt-8 text-center">
            <span className="text-[42px] font-mono font-bold text-[#1A1A1A] tracking-tighter">{formatTime(timer)}</span>
            <p className="text-[14px] text-[#666] font-bold uppercase mt-2 tracking-widest">{isRecording ? "Recording Session..." : "Tap to Start Clinical Capture"}</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
          <div className="relative w-28 h-28 flex items-center justify-center mb-8">
            <div className="absolute inset-0 border-[6px] border-primary/10 rounded-full animate-pulse" />
            <Loader2 className="text-primary animate-spin" size={64} />
          </div>
          <div className="text-center space-y-3">
             <h3 className="text-[22px] font-bold text-[#1A1A1A]">
                {processingStep === "transcribing" ? "Sarvam: Translating Mixed Script" : "Gemini: Extracting Clinical Data"}
             </h3>
             <p className="text-[15px] text-[#999] font-medium max-w-sm mx-auto">
                {processingStep === "transcribing" ? "Converting regional speech to structured clinical English..." : "Structuring diagnostics and medicine plan from transcription."}
             </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-8 bg-white border border-red-100 rounded-[32px] shadow-xl shadow-red-500/5 mb-8">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500"><AlertCircle size={24} /></div>
              <div>
                 <h4 className="text-[18px] font-bold text-[#1A1A1A]">Processing Interrupted</h4>
                 <p className="text-[14px] text-[#999] font-medium">{error}</p>
              </div>
           </div>
           <button onClick={() => { setError(null); setResult(null); setIsRecording(false); }} className="w-full py-4 bg-[#F8F8F8] border border-[#EEEEEE] rounded-2xl font-bold hover:bg-black hover:text-white transition-all">Retry Session</button>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
          
          <div className="bg-[#10B981] text-white p-10 rounded-[40px] relative overflow-hidden shadow-2xl shadow-[#10B981]/20 group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000"><CheckCircle2 size={120} /></div>
             <div className="relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-white/20 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Languages size={14} /> Mixed-Language Sync Active</div>
                         <div className="w-[1px] h-4 bg-white/20" />
                         <span className="text-[13px] font-bold uppercase tracking-[0.2em] opacity-80">Final Clinical Record</span>
                      </div>
                      <h3 className="text-[28px] font-bold tracking-tight">Clinical Insights Successfully Captured</h3>
                   </div>
                   <button onClick={() => setResult(null)} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[14px] font-bold transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-xl">
                      <RefreshCcw size={18} /> Redo Recording
                   </button>
                </div>

                {recordedAudioUrl && (
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-3">
                      <audio src={recordedAudioUrl} controls className="w-full h-8 opacity-95 invert brightness-100" />
                   </div>
                )}
             </div>
          </div>

          {/* WHOLE MATTER SUMMARY */}
          <div className="bg-white border-2 border-[#10B981]/10 rounded-[40px] p-10 shadow-sm relative">
             <div className="flex items-center gap-3 mb-6 text-[#10B981]">
                <Clipboard size={22} strokeWidth={2.5} />
                <h4 className="text-[12px] font-black uppercase tracking-[0.3em]">Full Consultation Narrative</h4>
             </div>
             <p className="text-[20px] font-medium leading-relaxed text-[#1A1A1A] italic whitespace-pre-wrap">
                "{result.full_narrative || result.summary}"
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Info size={22} /></div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Diagnostic Summary</h4>
              </div>
              <p className="text-[24px] font-bold text-[#1A1A1A] leading-tight mb-4">{result.diagnosis}</p>
              <div className="pt-6 border-t border-[#F0F0F0]">
                <p className="text-[15px] text-[#666] leading-relaxed font-medium">{result.summary}</p>
              </div>
            </div>

            <div className="bg-white border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6 font-bold text-[#1A1A1A]">
                 <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-[#10B981]"><FileText size={22} /></div>
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Prescribed Medication</h4>
              </div>
              <div className="space-y-3">
                {localMedicines.length > 0 ? localMedicines.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-2xl border border-[#EEEEEE]">
                    <span className="text-[16px] font-bold text-[#1A1A1A]">{m.name}</span>
                    <div className="w-8 h-[2px] bg-[#10B981] rounded-full" />
                  </div>
                )) : <p className="text-gray-400 italic">No medication identified.</p>}
              </div>
            </div>
          </div>

          {/* PRESCRIPTION PLANNER WITH CORRECT ALIGNMENT */}
          <div className="bg-white border border-[#EEEEEE] rounded-[40px] p-8 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-[22px] font-bold text-[#1A1A1A]">Prescription Planner</h3>
                <p className="text-[14px] text-[#999] font-medium mt-1 uppercase tracking-widest italic">Verify and refine medication dosing logic</p>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl text-[14px] font-bold hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95">
                    <Plus size={20} /> Add Entry
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] rounded-[32px] border-none p-10">
                   <DialogHeader>
                     <DialogTitle className="text-[24px] font-bold">New Medication Entry</DialogTitle>
                     <p className="text-[14px] text-gray-500 mt-1">Manual override for undetected medications.</p>
                   </DialogHeader>
                   <div className="grid gap-6 py-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medicine Name</label>
                        <input className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 focus:border-primary rounded-2xl outline-none transition-all font-bold" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strength</label>
                        <input className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 focus:border-primary rounded-2xl outline-none transition-all font-bold" value={newMed.strength} onChange={e => setNewMed({...newMed, strength: e.target.value})} />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</label>
                        <div className="grid grid-cols-3 gap-3">
                           {(['morning', 'afternoon', 'night'] as const).map(t => (
                             <button key={t} onClick={() => setNewMed({...newMed, timing: {...newMed.timing, [t]: !newMed.timing[t]}})} className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${newMed.timing[t] ? 'bg-primary/5 border-primary text-primary' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                               <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${newMed.timing[t] ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                 {newMed.timing[t] && <Check size={14} className="text-white" strokeWidth={3} />}
                               </div>
                               <span className="text-[9px] font-black uppercase tracking-widest">{t}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                   </div>
                   <DialogFooter>
                     <button onClick={handleManualAdd} className="w-full py-5 bg-primary text-white rounded-[20px] font-bold">Add to Plan</button>
                   </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-[#999] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#F5F5F5]">
                    <th className="text-left pb-6 pl-4 font-normal" style={{ width: '25%' }}>Medication</th>
                    <th className="text-left pb-6 font-normal" style={{ width: '15%' }}>Strength</th>
                    <th className="text-center pb-6 font-normal">MOR</th>
                    <th className="text-center pb-6 font-normal">AFT</th>
                    <th className="text-center pb-6 font-normal">NIG</th>
                    <th className="text-left pb-6 font-normal" style={{ width: '25%' }}>Instructions</th>
                    <th className="pb-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F9F9F9]">
                  {localMedicines.map((med, idx) => (
                    <tr key={idx} className="group hover:bg-[#FAFAFA] transition-all">
                      <td className="py-8 pl-4">
                        <div className="flex flex-col">
                            <span className="text-[17px] font-bold text-[#1A1A1A]">{med.name}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mt-0.5 italic">Clinical Insight</span>
                        </div>
                      </td>
                      <td className="py-8 text-[15px] font-bold text-gray-500">
                         {med.strength || <span className="text-gray-200">Standard</span>}
                      </td>
                      <td className="py-8">
                        <div className="flex justify-center">
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${med.timing.morning ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-200'}`}>
                             {med.timing.morning && <Check size={16} className="text-white" strokeWidth={3} />}
                           </div>
                        </div>
                      </td>
                      <td className="py-8">
                         <div className="flex justify-center">
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${med.timing.afternoon ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-200'}`}>
                             {med.timing.afternoon && <Check size={16} className="text-white" strokeWidth={3} />}
                           </div>
                        </div>
                      </td>
                      <td className="py-8">
                         <div className="flex justify-center">
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${med.timing.night ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-200'}`}>
                             {med.timing.night && <Check size={16} className="text-white" strokeWidth={3} />}
                           </div>
                        </div>
                      </td>
                      <td className="py-8 text-[14px] text-gray-500 font-medium leading-relaxed whitespace-normal pr-4">
                         {med.instructions || <span className="text-gray-200 italic">No instructions</span>}
                      </td>
                      <td className="py-8 text-right pr-4">
                        <button onClick={() => removeMed(idx)} className="p-3 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {localMedicines.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-24 text-center text-gray-300 font-bold uppercase tracking-widest text-[12px]">No data extracted</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            <div className="bg-white border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><CheckCircle2 size={22} /></div>
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Treatment Advice</h4>
              </div>
              <p className="text-[15px] leading-relaxed text-[#444] font-medium border-l-4 border-orange-100 pl-6 italic">{result.advice}</p>
            </div>

            <div className="bg-[#1A1A1A] p-10 rounded-[40px] shadow-2xl flex flex-col justify-between group h-full">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] block">Next Evaluation Cycle</span>
                <h4 className="text-[36px] font-bold text-[#10B981] leading-tight">{result.follow_up}</h4>
              </div>
              <button className="mt-12 w-full py-5 bg-white hover:bg-white/95 rounded-2xl text-[14px] font-black text-black transition-all active:scale-95">
                 Finalize Consultation Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceScribe;
