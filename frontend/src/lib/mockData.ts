export interface Clinic {
  id: string;
  _id?: string;
  name: string;
  location?: string;
  address?: string;
  phone?: string;
  email: string;
  adminName?: string;
  type?: 'Hospital' | 'Clinic' | 'Individual';
}

export interface Doctor {
  id: string;
  _id?: string;
  name: string;
  specialty: string;
  age: number;
  experience: number;
  status: 'available' | 'busy' | 'break';
  patientsToday: number;
  completedOPs: number;
  ongoingOPs: number;
  totalHandled: number;
  currentToken?: string;
  phone: string;
  email: string;
  clinicId?: string;
  clinicName?: string;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
}

export interface OPRecord {
  id: string;
  _id?: string;
  date: string;
  complaint: string;
  diagnosis: string;
  prescription: Prescription[];
  doctorName: string;
  followUp: string;
  status: 'Completed' | 'Pending' | 'Follow-up';
}

export interface Patient {
  id: string;
  _id?: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  lastVisit: string;
  assignedDoctor: string;
  assignedDoctorId?: string;
  bloodGroup: string;
  phone: string;
  email: string;
  medicalHistory: string;
  opRecords: OPRecord[];
  token?: string;
  status?: 'waiting' | 'consultation' | 'completed';
  clinicId?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  isRead: boolean;
  targetRole: 'clinic' | 'doctor' | 'patient' | 'all';
  clinicId?: string;
  doctorId?: string;
  patientId?: string;
}

export const initialClinics: Clinic[] = [
  { id: 'clinic-1', name: 'Apollo Medical Center', email: 'admin@clinic.com', location: 'Hyderabad, TS', type: 'Hospital' },
  { id: 'clinic-2', name: 'MedLife Clinic', email: 'medlife@clinic.com', location: 'Tashkent, UZ', type: 'Clinic' },
  { id: 'clinic-3', name: 'Wellness Family Practice', email: 'wellness@clinic.com', location: 'Bangalore, KA', type: 'Clinic' },
  { id: 'none', name: 'Independent Practice', email: 'indie@clinic.com', location: 'N/A', type: 'Individual' }
];

export const specialties = [
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedics",
  "General Physician",
  "Pediatrician",
  "Oncologist",
  "Psychiatrist"
];

export const initialDoctors: Doctor[] = [
  {
    id: "1",
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
    clinicId: "clinic-1"
  },
  {
    id: "2",
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
    clinicId: "clinic-1"
  },
  {
    id: "3",
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
    clinicId: "clinic-1"
  },
  {
    id: "4",
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
    clinicId: "clinic-1"
  }
];

export const initialPatients: Patient[] = [
  {
    id: "p1",
    name: "Riya Shah",
    age: 28,
    gender: "F",
    lastVisit: "14 Mar 2025",
    assignedDoctor: "Dr. Ayasha Malik",
    bloodGroup: "O+",
    phone: "+998 91 111 22 33",
    email: "riya@example.com",
    medicalHistory: "History of seasonal allergies and mild hypertension.",
    clinicId: "clinic-1",
    token: "#07",
    status: "consultation",
    opRecords: [
      {
        id: "r1",
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
        id: "r1-2",
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
    id: "p2",
    name: "Ahmed Khan",
    age: 45,
    gender: "M",
    lastVisit: "12 Mar 2025",
    assignedDoctor: "Dr. Samuel Torres",
    bloodGroup: "A-",
    phone: "+998 91 222 33 44",
    email: "ahmed@example.com",
    medicalHistory: "Type 2 Diabetes managed with metformin.",
    clinicId: "clinic-1",
    token: "#15",
    status: "waiting",
    opRecords: [
      {
        id: "r2",
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
        id: "r2-2",
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
    id: "p3",
    name: "Lola Mirzaeva",
    age: 35,
    gender: "F",
    lastVisit: "10 Apr 2025",
    assignedDoctor: "Dr. Priya Nair",
    bloodGroup: "B+",
    phone: "+998 91 444 55 66",
    email: "lola@example.com",
    medicalHistory: "No prior major illnesses.",
    clinicId: "clinic-1",
    token: "#02",
    status: "completed",
    opRecords: [
      {
        id: "r3",
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
        id: "r3-2",
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
    id: "p4",
    name: "Viktor Petrov",
    age: 52,
    gender: "M",
    lastVisit: "15 Apr 2025",
    assignedDoctor: "Dr. Rajan Mehta",
    bloodGroup: "O+",
    phone: "+998 91 777 88 99",
    email: "viktor@example.com",
    medicalHistory: "Mild hypertension.",
    clinicId: "clinic-1",
    token: "#09",
    status: "consultation",
    opRecords: [
      {
        id: "r4",
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

export const initialNotifications: Notification[] = [
  {
    id: "n1",
    title: "New Patient Registered",
    description: "Lola Mirzaeva has been added by the front desk.",
    time: "2 mins ago",
    type: "success",
    isRead: false,
    targetRole: 'clinic',
    clinicId: 'clinic-1'
  },
  {
    id: "n2",
    title: "Status Update",
    description: "Dr. Rajan Mehta is now Busy.",
    time: "15 mins ago",
    type: "info",
    isRead: true,
    targetRole: 'clinic',
    clinicId: 'clinic-1'
  }
];
