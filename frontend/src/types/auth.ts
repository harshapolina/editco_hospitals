import { Patient, OPRecord } from '../lib/mockData';

export interface ClinicLoginPayload {
  email: string;
  password: string;
}

export interface ClinicRegisterPayload {
  name: string;
  email: string;
  password: string;
  adminName?: string;
  phone?: string;
  address?: string;
}

export interface DoctorRegisterPayload {
  name: string;
  email: string;
  password: string;
  specialty: string;
  age?: number | string;
  experience?: number | string;
  phone?: string;
  status?: 'available' | 'busy' | 'break';
  clinicId?: string;
  clinicName?: string;
}

export interface PatientLoginPayload {
  email: string;
  password?: string;
}

export interface PatientRegisterPayload {
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  bloodGroup: string;
}

export interface AppointmentPayload {
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: string;
  time: string;
  reason?: string;
}

export interface OPCompletePayload {
  patientId: string;
  record: Omit<OPRecord, 'id' | '_id' | 'date' | 'status'>;
}
