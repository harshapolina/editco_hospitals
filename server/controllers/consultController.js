import { GoogleGenerativeAI } from '@google/generative-ai';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import mongoose from 'mongoose';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY');

export const processConsultation = async (req, res) => {
  try {
    const { transcript } = req.body; 
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ message: 'Gemini API Key is missing' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a medical scribe. Analyze the following conversation transcript 
      between a doctor and a patient and generate a structured medical record in JSON format.
      
      Conversation: "${transcript || "Simulated consultation about chest pain"}"
      
      Required JSON structure (MUST BE VALID JSON):
      {
        "complaint": "Short summary of patient's issue",
        "diagnosis": "Professional medical diagnosis",
        "prescription": [
          { "medication": "Name", "strength": "e.g. 500mg", "frequency": "e.g. 2x Daily", "m": 1, "a": 0, "n": 1, "instructions": "e.g. After food" }
        ],
        "advice": "General medical advice",
        "followUp": "When to visit next",
        "status": "Completed"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const jsonStr = text.replace(/```json|```/g, '').trim();
    let structuredData;
    try {
        structuredData = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error('JSON Parse Error:', text);
        // Fallback for simple parsing if AI includes extra text
        const matches = text.match(/\{[\s\S]*\}/);
        if (matches) {
            structuredData = JSON.parse(matches[0]);
        } else {
            throw new Error('Failed to parse AI response as JSON');
        }
    }

    res.json(structuredData);
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ message: 'AI Processing failed', error: error.message });
  }
};

export const saveConsultation = async (req, res) => {
  const patientId = req.params.id || req.body.patientId;
  const { record, doctorId } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ message: 'Invalid Patient ID format. This patient is not yet synced to the cloud.' });
  }

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.opRecords.push({
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      doctorId: doctorId,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    
    patient.status = 'completed';
    patient.lastVisit = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const updatedPatient = await patient.save();

    // Update Doctor stats and Token Queue (only if doctor exists in DB)
    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
      try {
        const doctor = await Doctor.findById(doctorId);
        if (doctor) {
          // Find next patient in queue
          const nextPatient = await Patient.findOne({ 
            $or: [{ assignedDoctor: doctor.name }, { assignedDoctorId: doctorId }],
            status: 'waiting'
          }).sort({ createdAt: 1 });

          doctor.completedOPs = (doctor.completedOPs || 0) + 1;
          doctor.status = 'available';
          doctor.currentToken = nextPatient ? nextPatient.token : "None";
          await doctor.save();
        }
      } catch (docError) {
        console.error('Non-critical Doctor Update Error:', docError);
        // We don't fail the whole request if only the doctor's counter fails
      }
    }

    res.json({ message: 'Consultation saved successfully', patient: updatedPatient });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ message: error.message });
  }
};
