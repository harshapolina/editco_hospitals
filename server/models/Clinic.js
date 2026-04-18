import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  adminName: {
    type: String,
  },
  specialties: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
});

const Clinic = mongoose.model('Clinic', clinicSchema);

export default Clinic;
