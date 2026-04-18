import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, default: 'Report' }, // e.g., 'Blood Test', 'X-Ray'
  date: { type: String, required: true },
  fileUrl: { type: String }, // Path to the uploaded PDF/Image
  fileType: { type: String }, // 'pdf' | 'image'
  voiceUrl: { type: String }, // Path to the uploaded audio explanation
  summary: { type: String }, // AI generated or manual summary
  notes: { type: String },
  clinicId: { type: String } // Optional: if uploaded via a clinic
}, { timestamps: true });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
