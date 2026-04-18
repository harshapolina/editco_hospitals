import express from 'express';
import Patient from '../models/Patient.js';
import mongoose from 'mongoose';
import { saveConsultation, processConsultation } from '../controllers/consultController.js';
import { 
  registerPatient, 
  loginPatient, 
  bookAppointment, 
  getPatientAppointments, 
  uploadMedicalRecord, 
  getPatientTimeline 
} from '../controllers/patientController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// AUTH ROUTES
router.post('/register', registerPatient);
router.post('/login', loginPatient);

// APPOINTMENT ROUTES
router.post('/appointments', bookAppointment);
router.get('/:id/appointments', getPatientAppointments);

// RECORD & TIMELINE ROUTES
router.post('/:id/records-upload', upload.fields([
  { name: 'report', maxCount: 1 },
  { name: 'voice', maxCount: 1 }
]), uploadMedicalRecord);
router.get('/:id/timeline', getPatientTimeline);

// LEGACY & CLINIC-FACING ROUTES
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Patient ID format' });
    }
    const patient = await Patient.findById(id);
    if (patient) {
      patient.status = req.body.status;
      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Patient ID format' });
    }
    const patient = await Patient.findById(id);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/records', saveConsultation);
router.post('/process-consult', processConsultation);

export default router;

