import express from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// @desc    Get all doctors
// @route   GET /api/doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add new doctor
// @route   POST /api/doctors
router.post('/', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    // Check for logical duplicates by email
    if (email) {
      email = email.toLowerCase().trim();
      const existing = await Doctor.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Doctor with this email already exists' });
      }
    }

    const doctor = new Doctor({
      ...req.body,
      email, // Use normalized email
      password: password || 'password123' // Use provided password or default
    });
    const createdDoctor = await doctor.save();
    res.status(201).json(createdDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Doctor ID format. Local-only records can be removed from the UI.' });
    }

    const doctor = await Doctor.findByIdAndDelete(id);
    if (doctor) {
      res.json({ message: 'Doctor removed successfully' });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update doctor
// @route   PATCH /api/doctors/:id
router.patch('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      Object.assign(doctor, req.body);
      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
