import mongoose from 'mongoose';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';
import MedicalRecord from './models/MedicalRecord.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telecare');
    console.log("Connected to DB for seeding...");

    // 1. Create Demo Patient
    const demoPatient = {
      name: "Harsh Polina",
      email: "patient@docinpoc.com",
      password: "password123", // Prototype: plain text, matches login check
      age: 26,
      gender: "M",
      bloodGroup: "O+",
      phone: "+91 9876543210",
      status: "completed",
      opRecords: [
        {
          date: "10 Apr 2026",
          doctorName: "Dr. Smith",
          diagnosis: "Seasonal Allergies",
          complaint: "Runny nose, itchy eyes",
          prescription: [{ medication: "Cetirizine", dosage: "10mg", frequency: "Once daily" }],
          followUp: "2 weeks"
        },
        {
          date: "15 Mar 2026",
          doctorName: "Dr. Ray",
          diagnosis: "Vitamin D Deficiency",
          complaint: "Fatigue and bone pain",
          prescription: [{ medication: "D-Rise 60K", dosage: "60,000 IU", frequency: "Weekly" }],
          followUp: "1 month"
        }
      ]
    };

    const patient = await Patient.findOneAndUpdate(
      { email: demoPatient.email },
      demoPatient,
      { upsert: true, new: true }
    );
    console.log("Demo Patient Seeded");

    // 2. Add a Past Record
    await MedicalRecord.create({
      patientId: patient._id,
      title: "Annual Blood Work",
      date: "12 Apr 2026",
      summary: "All vitals within normal range. HDL is slightly low.",
      fileUrl: "",
      notes: "Routine checkup"
    });

    console.log("Seed complete! You can now login with: patient@docinpoc.com / password123");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
