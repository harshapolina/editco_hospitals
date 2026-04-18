import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: { type: String },
  doctorId: { type: String, required: true },
  doctorName: { type: String },
  clinicId: { type: String, required: true },
  clinicName: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  tokenNumber: { type: String },
  status: { 
    type: String, 
    enum: ['upcoming', 'completed', 'cancelled', 'noshow'], 
    default: 'upcoming' 
  },
  reason: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
