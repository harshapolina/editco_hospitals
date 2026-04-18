import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import SttProvider from '../services/SttProvider.js';
import LlmProvider from '../services/LlmProvider.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ 
  dest: 'uploads/temp/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Production-grade processing endpoint
router.post('/process', upload.single('audio'), async (req, res) => {
  const audioFile = req.file;
  const { patientName } = req.body;

  if (!audioFile) {
    return res.status(400).json({ status: 'failed', message: 'No audio file provided' });
  }

  try {
    console.log(`[PIPELINE] Incoming request for patient: ${patientName}`);
    console.log(`[PIPELINE] Audio file received: ${audioFile.originalname} (${audioFile.size} bytes)`);

    // 1. Transcription Phase
    console.log(`[PIPELINE] Starting STT Phase...`);
    const sttResult = await SttProvider.transcribe(audioFile.path);
    console.log(`[PIPELINE] STT Phase Complete. Provider: ${sttResult.provider}`);
    console.log(`[PIPELINE] FULL TRANSCRIPT: "${sttResult.transcript}"`);
    
    // 2. LLM Structuring Phase
    console.log(`[PIPELINE] Starting LLM Phase...`);
    const structuredResult = await LlmProvider.processTranscript(sttResult.transcript, patientName);
    console.log(`[PIPELINE] LLM Phase Complete.`);

    // Cleanup
    if (fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);

    // 3. Final Formatted Response
    return res.json({
      status: "completed",
      transcript: sttResult.transcript,
      is_unclear: sttResult.is_unclear,
      structured: {
        full_narrative: structuredResult.full_narrative,
        summary: structuredResult.summary,
        problem: structuredResult.problem,
        diagnosis: structuredResult.diagnosis,
        prescription: structuredResult.prescription,
        medicines: structuredResult.medicines || [],
        advice: structuredResult.advice,
        follow_up: structuredResult.follow_up
      },
      provider_used: {
        stt: sttResult.provider,
        llm: "gemini"
      }
    });

  } catch (error) {
    console.error('Pipeline Error:', error);
    if (audioFile && fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);
    
    res.status(500).json({ 
      status: "failed", 
      message: error.message || "Internal processing failure" 
    });
  }
});

export default router;
