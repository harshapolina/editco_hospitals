import mongoose from 'mongoose';

const opRecordSchema = new mongoose.Schema({
  date: { type: String, required: true },
  complaint: { type: String },
  diagnosis: { type: String },
  prescription: [{
    medication: String,
    dosage: String,
    frequency: String
  }],
  doctorName: { type: String },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  followUp: { type: String },
  status: { 
    type: String, 
    enum: ['Completed', 'Pending', 'Follow-up'], 
    default: 'Completed' 
  }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['M', 'F'], required: true },
  lastVisit: { type: String },
  assignedDoctor: { type: String }, // Can be name or ID, stored as string for compatibility
  assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  bloodGroup: { type: String },
  phone: { type: String },
  email: { type: String, unique: true },
  password: { type: String }, // In real app, hash this
  medicalHistory: { type: String },
  token: { type: String },
  status: { 
    type: String, 
    enum: ['waiting', 'consultation', 'completed'], 
    default: 'waiting' 
  },
  clinicId: { type: String },
  vitals: {
    bloodGroup: { type: String, default: 'O+' },
    pulseRate: { type: String, default: '72' },
    oxygenLevel: { type: String, default: '98%' },
    bmi: { type: String, default: '22.4' }
  },
  opRecords: [opRecordSchema]
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
