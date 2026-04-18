import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import connectDB from '../config/db.js';

dotenv.config();

const initialDoctors = [
  {
    name: "Dr. Ayasha Malik",
    specialty: "Cardiologist",
    age: 34,
    experience: 8,
    status: "available",
    patientsToday: 12,
    completedOPs: 8,
    ongoingOPs: 1,
    totalHandled: 1240,
    currentToken: "#07",
    phone: "+998 90 123 45 67",
    email: "ayasha@docinpoc.com",
    password: "password123"
  },
  {
    name: "Dr. Rajan Mehta",
    specialty: "Neurologist",
    age: 41,
    experience: 14,
    status: "busy",
    patientsToday: 18,
    completedOPs: 12,
    ongoingOPs: 2,
    totalHandled: 2840,
    currentToken: "#12",
    phone: "+998 90 987 65 43",
    email: "rajan@docinpoc.com",
    password: "password123"
  },
  {
    name: "Dr. Priya Nair",
    specialty: "Dermatologist",
    age: 29,
    experience: 4,
    status: "break",
    patientsToday: 6,
    completedOPs: 4,
    ongoingOPs: 0,
    totalHandled: 540,
    currentToken: "#03",
    phone: "+998 90 555 11 22",
    email: "priya@docinpoc.com",
    password: "password123"
  },
  {
    name: "Dr. Samuel Torres",
    specialty: "Orthopedics",
    age: 47,
    experience: 20,
    status: "available",
    patientsToday: 9,
    completedOPs: 7,
    ongoingOPs: 0,
    totalHandled: 4210,
    currentToken: "#05",
    phone: "+998 90 444 88 99",
    email: "samuel@docinpoc.com",
    password: "password123"
  }
];

const initialPatients = [
  {
    name: "Riya Shah",
    age: 28,
    gender: "F",
    lastVisit: "14 Mar 2025",
    assignedDoctor: "Dr. Ayasha Malik",
    bloodGroup: "O+",
    phone: "+998 91 111 22 33",
    email: "riya@example.com",
    medicalHistory: "History of seasonal allergies and mild hypertension.",
    token: "#07",
    status: "consultation",
    opRecords: [
      {
        date: "14 Mar 2025",
        complaint: "Occasional chest tightness during exercise",
        diagnosis: "Mild exercise-induced asthma suspect",
        prescription: [
          { medication: "Albuterol inhaler", dosage: "2 puffs", frequency: "as needed before exercise" }
        ],
        doctorName: "Dr. Ayasha Malik",
        followUp: "28 Mar 2025",
        status: "Completed"
      },
      {
        date: "10 Jan 2025",
        complaint: "General Fatigue",
        diagnosis: "Vitamin D deficiency",
        prescription: [
          { medication: "Vitamin D3", dosage: "2000 IU", frequency: "daily" }
        ],
        doctorName: "Dr. Ayasha Malik",
        followUp: "None",
        status: "Completed"
      }
    ]
  },
  {
    name: "Ahmed Khan",
    age: 45,
    gender: "M",
    lastVisit: "12 Mar 2025",
    assignedDoctor: "Dr. Samuel Torres",
    bloodGroup: "A-",
    phone: "+998 91 222 33 44",
    email: "ahmed@example.com",
    medicalHistory: "Type 2 Diabetes managed with metformin.",
    token: "#15",
    status: "waiting",
    opRecords: [
      {
        date: "12 Mar 2025",
        complaint: "Routine blood sugar checkup",
        diagnosis: "Stable glycemic control",
        prescription: [
          { medication: "Metformin", dosage: "500mg", frequency: "twice daily after meals" }
        ],
        doctorName: "Dr. Samuel Torres",
        followUp: "12 Jun 2025",
        status: "Completed"
      },
      {
        date: "05 Dec 2024",
        complaint: "Blurred vision in evening",
        diagnosis: "Diabetic Retinopathy Screen (Negative)",
        prescription: [],
        doctorName: "Dr. Samuel Torres",
        followUp: "Routine Annual",
        status: "Completed"
      }
    ]
  },
  {
    name: "Lola Mirzaeva",
    age: 35,
    gender: "F",
    lastVisit: "10 Apr 2025",
    assignedDoctor: "Dr. Priya Nair",
    bloodGroup: "B+",
    phone: "+998 91 444 55 66",
    email: "lola@example.com",
    medicalHistory: "No prior major illnesses.",
    token: "#02",
    status: "completed",
    opRecords: [
      {
        date: "10 Apr 2025",
        complaint: "Skin rash on forearms",
        diagnosis: "Contact dermatitis",
        prescription: [
          { medication: "Hydrocortisone cream", dosage: "Apply thin layer", frequency: "twice daily" },
          { medication: "Cetirizine", dosage: "10mg", frequency: "once daily" }
        ],
        doctorName: "Dr. Priya Nair",
        followUp: "17 Apr 2025",
        status: "Follow-up"
      },
      {
        date: "22 Feb 2025",
        complaint: "Annual physical exam",
        diagnosis: "Healthy",
        prescription: [],
        doctorName: "Dr. Priya Nair",
        followUp: "Next Year",
        status: "Completed"
      }
    ]
  },
  {
    name: "Viktor Petrov",
    age: 52,
    gender: "M",
    lastVisit: "15 Apr 2025",
    assignedDoctor: "Dr. Rajan Mehta",
    bloodGroup: "O+",
    phone: "+998 91 777 88 99",
    email: "viktor@example.com",
    medicalHistory: "Mild hypertension.",
    token: "#09",
    status: "consultation",
    opRecords: [
      {
        date: "15 Apr 2025",
        complaint: "Persistent headache",
        diagnosis: "Tension headache",
        prescription: [
          { medication: "Paracetamol", dosage: "500mg", frequency: "every 6 hours" }
        ],
        doctorName: "Dr. Rajan Mehta",
        followUp: "22 Apr 2025",
        status: "Pending"
      }
    ]
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Doctor.deleteMany();
    await Patient.deleteMany();

    await Doctor.insertMany(initialDoctors);
    await Patient.insertMany(initialPatients);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
