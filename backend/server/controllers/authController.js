import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Clinic from '../models/Clinic.js';

// @desc    Register a new doctor
// @route   POST /api/auth/register
// @access  Public
export const registerDoctor = async (req, res) => {
  let { name, email, password, specialty, age } = req.body;
  
  if (!email || !password || !name || !specialty) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  email = email.trim().toLowerCase();

  try {
    const doctorExists = await Doctor.findOne({ email });

    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor already exists with this email' });
    }

    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialty,
      age: Number(age) || 30, // Fallback if not provided
      status: 'available',
      experience: 0,
      patientsToday: 0,
      clinicId: req.body.clinicId,
      clinicName: req.body.clinicName
    });

    if (doctor) {
      console.log(`New doctor registered: ${email}`);
      res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        role: 'doctor',
        token: jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      });
    } else {
      res.status(400).json({ message: 'Invalid doctor data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Auth doctor & get token
// @route   POST /api/auth/login
// @access  Public
export const loginDoctor = async (req, res) => {
  let { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  email = email.trim().toLowerCase();

  try {
    const doctor = await Doctor.findOne({ email });

    // Simple password check (in real app, use bcrypt)
    if (doctor && (password === doctor.password)) {
      res.json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        role: 'doctor',
        token: jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new clinic
// @route   POST /api/auth/clinic/register
export const registerClinic = async (req, res) => {
  let { name, email, password, address, phone, adminName } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide clinic name, email and password' });
  }

  email = email.trim().toLowerCase();

  try {
    const clinicExists = await Clinic.findOne({ email });
    if (clinicExists) {
      return res.status(400).json({ message: 'Clinic already registered with this email' });
    }

    const clinic = await Clinic.create({
      name,
      email,
      password,
      address,
      phone,
      adminName
    });

    if (clinic) {
      res.status(201).json({
        _id: clinic._id,
        id: clinic._id, // Add id for frontend compatibility
        name: clinic.name,
        email: clinic.email,
        role: 'clinic',
        token: jwt.sign({ id: clinic._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth clinic & get token
// @route   POST /api/auth/clinic/login
export const loginClinic = async (req, res) => {
  let { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  email = email.trim().toLowerCase();

  // MOCK BYPASS: For demo credentials
  if (email === 'admin@clinic.com' && password === 'clinic123') {
    return res.json({
      _id: 'clinic-1',
      id: 'clinic-1',
      name: 'Apollo Medical Center',
      email: 'admin@clinic.com',
      role: 'clinic',
      token: 'mock-token-123'
    });
  }

  try {
    const clinic = await Clinic.findOne({ email });

    if (clinic && (password === clinic.password)) {
      res.json({
        _id: clinic._id,
        id: clinic._id,
        name: clinic.name,
        email: clinic.email,
        role: 'clinic',
        token: jwt.sign({ id: clinic._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update clinic profile
// @route   PATCH /api/auth/clinic/:id
export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    const { name, address, phone, adminName } = req.body;
    
    if (name) clinic.name = name;
    if (address) clinic.address = address;
    if (phone) clinic.phone = phone;
    if (adminName) clinic.adminName = adminName;

    const updatedClinic = await clinic.save();

    res.json({
      _id: updatedClinic._id,
      id: updatedClinic._id,
      name: updatedClinic.name,
      email: updatedClinic.email,
      address: updatedClinic.address,
      phone: updatedClinic.phone,
      adminName: updatedClinic.adminName,
      role: 'clinic'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered clinics
// @route   GET /api/auth/clinics
export const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({}, 'name address _id');
    const formattedClinics = clinics.map(c => ({
      id: c._id,
      name: c.name,
      location: c.address || 'Location not specified'
    }));
    res.json(formattedClinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
