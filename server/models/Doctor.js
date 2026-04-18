import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In real app, hash this
  specialty: { type: String, required: true },
  age: { type: Number },
  experience: { type: Number },
  status: { 
    type: String, 
    enum: ['available', 'busy', 'break'], 
    default: 'available' 
  },
  patientsToday: { type: Number, default: 0 },
  completedOPs: { type: Number, default: 0 },
  ongoingOPs: { type: Number, default: 0 },
  totalHandled: { type: Number, default: 0 },
  currentToken: { type: String },
  phone: { type: String },
  clinicId: { type: String },
  clinicName: { type: String }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
