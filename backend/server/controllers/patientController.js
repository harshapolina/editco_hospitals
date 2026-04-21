import Patient from '../models/Patient.js';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Doctor from '../models/Doctor.js';
import jwt from 'jsonwebtoken';

// @desc    Register a new patient
// @route   POST /api/patients/register
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, age, gender, phone, bloodGroup } = req.body;
    
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      // If patient exists but has no password, update it (first time portal registration)
      if (!patientExists.password) {
        patientExists.password = password;
        if (name) patientExists.name = name;
        if (age) patientExists.age = age;
        if (gender) patientExists.gender = gender;
        if (phone) patientExists.phone = phone;
        if (bloodGroup) patientExists.bloodGroup = bloodGroup;
        
        const updatedPatient = await patientExists.save();
        const token = jwt.sign({ id: updatedPatient._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        return res.status(200).json({ ...updatedPatient._doc, token });
      }
      return res.status(400).json({ message: 'Patient already registered' });
    }

    const patient = await Patient.create({
      name, email, password, age, gender, phone, bloodGroup
    });

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.status(201).json({ ...patient._doc, token });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message, error: error.stack });
  }
};

// @desc    Login patient
// @route   POST /api/patients/login
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (patient && (password === patient.password)) { // Simple check for prototype
      const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      res.json({ ...patient._doc, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message, error: error.stack });
  }
};

// @desc    Book an appointment
// @route   POST /api/patients/appointments
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, clinicId, date, time, reason } = req.body;
    
    const doctor = (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) 
      ? await Doctor.findById(doctorId) 
      : await Doctor.findOne({ email: doctorId });
    
    const patient = (patientId && mongoose.Types.ObjectId.isValid(patientId))
      ? await Patient.findById(patientId)
      : await Patient.findOne({ email: patientId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found for booking' });
    }

    // UPDATE PATIENT ASSOCIATION: This ensures the patient shows up in the clinic's and doctor's dashboard tabs
    patient.clinicId = clinicId;
    patient.assignedDoctorId = doctor?._id;
    patient.assignedDoctor = doctor?.name || 'Dr. Specialist';
    patient.status = 'waiting'; // Set initial status for the appointment queue
    await patient.save();

    const appointment = await Appointment.create({
      patientId: patient._id, // Use the database ID
      patientName: patient?.name,
      doctorId,
      doctorName: doctor?.name,
      clinicId,
      clinicName: doctor?.clinicName || 'Clinic Name',
      date,
      time,
      reason,
      tokenNumber: `#${Math.floor(Math.random() * 90 + 10)}`
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: error.message, error: error.stack });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/:id/appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error('Fetch Appointments Error:', error);
    res.status(500).json({ message: error.message, error: error.stack });
  }
};

// @desc    Upload medical record
// @route   POST /api/patients/:id/records-upload
export const uploadMedicalRecord = async (req, res) => {
  try {
    const { title, date, notes, summary } = req.body;
    const files = req.files; // From multer
    
    let fileUrl = '';
    let voiceUrl = '';
    let fileType = '';

    if (files['report']) {
      fileUrl = `/uploads/${files['report'][0].filename}`;
      fileType = files['report'][0].mimetype.includes('pdf') ? 'pdf' : 'image';
    }
    
    if (files['voice']) {
      voiceUrl = `/uploads/${files['voice'][0].filename}`;
    }

    const record = await MedicalRecord.create({
      patientId: req.params.id,
      title,
      date,
      notes,
      summary,
      fileUrl,
      fileType,
      voiceUrl
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message, error: error.stack });
  }
};

// @desc    Get patient health timeline
// @route   GET /api/patients/:id/timeline
export const getPatientTimeline = async (req, res) => {
  try {
    const patientId = req.params.id;
    
    // Fetch all relevant health events in parallel
    const [appointments, records, patient] = await Promise.all([
      Appointment.find({ patientId, status: { $in: ['upcoming', 'completed'] } }).lean(),
      MedicalRecord.find({ patientId }).lean(),
      (patientId && mongoose.Types.ObjectId.isValid(patientId))
        ? Patient.findById(patientId).lean() 
        : Patient.findOne({ email: patientId }).lean()
    ]);

    // Construct timeline array
    const timeline = [];

    // Add consultation history from Patient.opRecords
    if (patient && Array.isArray(patient.opRecords)) {
      patient.opRecords.forEach(op => {
        if (!op.date) return;
        timeline.push({
          id: op._id || op.id || Math.random().toString(36).substr(2, 9),
          date: op.date,
          type: 'Consultation',
          title: `Consultation with ${op.doctorName || 'Doctor'}`,
          description: op.diagnosis || 'General Checkup',
          data: op
        });
      });
    }

    // Add uploaded records
    if (Array.isArray(records)) {
      records.forEach(rec => {
        if (!rec.date) return;
        timeline.push({
          id: rec._id,
          date: rec.date,
          type: 'Medical Record',
          title: rec.title || 'Medical Record',
          description: rec.summary || 'Lab Report / Imaging',
          data: rec
        });
      });
    }

    // Sort by date descending with safety checks
    timeline.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateB - dateA;
    });

    res.json(timeline);
  } catch (error) {
    console.error('Timeline Error:', error);
    res.status(500).json({ message: error.message, error: error.stack });
  }
};
