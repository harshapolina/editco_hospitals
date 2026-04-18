import Patient from '../models/Patient.js';
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book an appointment
// @route   POST /api/patients/appointments
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, clinicId, date, time, reason } = req.body;
    
    const doctor = mongoose.Types.ObjectId.isValid(doctorId) 
      ? await Doctor.findById(doctorId) 
      : await Doctor.findOne({ email: doctorId }); // Fallback for mock doctors if they have emails as IDs
    
    const patient = mongoose.Types.ObjectId.isValid(patientId)
      ? await Patient.findById(patientId)
      : await Patient.findOne({ email: patientId });

    const appointment = await Appointment.create({
      patientId,
      patientName: patient?.name,
      doctorId,
      doctorName: doctor?.name,
      clinicId,
      clinicName: doctor?.clinicName || 'Clinic',
      date,
      time,
      reason,
      tokenNumber: `#${Math.floor(Math.random() * 90 + 10)}`
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/:id/appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient health timeline
// @route   GET /api/patients/:id/timeline
export const getPatientTimeline = async (req, res) => {
  try {
    const patientId = req.params.id;
    
    // Fetch all relevant health events
    const [appointments, records, patient] = await Promise.all([
      Appointment.find({ patientId, status: { $in: ['upcoming', 'completed'] } }),
      MedicalRecord.find({ patientId }),
      mongoose.Types.ObjectId.isValid(patientId) ? Patient.findById(patientId) : Patient.findOne({ _id: patientId })
    ]);

    // Construct timeline array
    const timeline = [];

    // Add consultation history from Patient.opRecords
    if (patient && patient.opRecords) {
      patient.opRecords.forEach(op => {
        timeline.push({
          id: op._id,
          date: op.date,
          type: 'Consultation',
          title: `Consultation with ${op.doctorName}`,
          description: op.diagnosis,
          data: op
        });
      });
    }

    // Add uploaded records
    records.forEach(rec => {
      timeline.push({
        id: rec._id,
        date: rec.date,
        type: 'Medical Record',
        title: rec.title,
        description: rec.summary || 'Lab Report / Imaging',
        data: rec
      });
    });

    // Sort by date descending
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
