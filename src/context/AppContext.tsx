import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  Doctor, 
  Patient, 
  Notification, 
  Clinic,
  initialNotifications,
  initialClinics,
  initialDoctors,
  initialPatients
} from '@/lib/mockData';

import { 
  ClinicLoginPayload, 
  ClinicRegisterPayload, 
  DoctorRegisterPayload,
  PatientLoginPayload,
  PatientRegisterPayload,
  AppointmentPayload
} from '@/types/auth';

interface AppContextType {
  doctors: Doctor[];
  patients: Patient[];
  clinics: Clinic[];
  notifications: Notification[];
  currentDoctor: Doctor | null;
  currentClinic: Clinic | null;
  currentPatient: Patient | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: DoctorRegisterPayload) => Promise<void>;
  logout: () => void;
  loginClinic: (credentials: ClinicLoginPayload) => Promise<void>;
  registerClinic: (clinicData: ClinicRegisterPayload) => Promise<void>;
  logoutClinic: () => void;
  loginPatient: (credentials: PatientLoginPayload) => Promise<void>;
  registerPatient: (userData: PatientRegisterPayload) => Promise<void>;
  logoutPatient: () => void;
  fetchData: () => Promise<void>;

  addDoctor: (doctor: DoctorRegisterPayload) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>;
  toggleDoctorStatus: (id: string) => Promise<void>;
  addPatient: (patient: any) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  completeOP: (patientId: string, record: any) => Promise<void>;
  startOP: (patientId: string) => Promise<void>;
  updatePatientStatus: (patientId: string, status: Patient['status']) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  updateClinic: (updates: Partial<ClinicRegisterPayload>) => Promise<void>;
  bookAppointment: (data: AppointmentPayload) => Promise<void>;
  uploadPatientRecord: (patientId: string, formData: FormData) => Promise<void>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('clinic_doctors');
    if (saved) return JSON.parse(saved);
    return initialDoctors.map(d => ({ ...d, id: d.id || d._id }));
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('clinic_patients');
    if (saved) return JSON.parse(saved);
    return initialPatients.map(p => ({ ...p, id: p.id || p._id }));
  });

  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [loading, setLoading] = useState(true);
  
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(() => {
    const saved = localStorage.getItem('doctor_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentClinic, setCurrentClinic] = useState<Clinic | null>(() => {
    const saved = localStorage.getItem('clinic_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentPatient, setCurrentPatient] = useState<Patient | null>(() => {
    const saved = localStorage.getItem('patient_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('clinic_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Fetch initial data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, patientsRes, clinicsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/patients'),
        api.get('/auth/clinics')
      ]);
      
      // Sync Doctors
      if (docsRes.data && Array.isArray(docsRes.data)) {
        const incoming = docsRes.data.map((d: any) => ({ ...d, id: d.id || d._id }));
        
        setDoctors(prev => {
          const doctorMap = new Map();
          
          // 1. Seed with initial mock data (Always present in local state for demo)
          initialDoctors.forEach(d => {
            const key = d.email?.toLowerCase() || d.id;
            doctorMap.set(key, { ...d, id: d.id || d._id });
          });

          // 2. Merge with current state (prev)
          prev.forEach(d => {
            const key = d.email?.toLowerCase() || d.id || d._id;
            if (key) doctorMap.set(key, { ...doctorMap.get(key), ...d });
          });
          
          // 3. Overwrite/Merge with incoming data from DB
          incoming.forEach(d => {
            const key = d.email?.toLowerCase() || d.id || d._id;
            if (key) {
              const existing = doctorMap.get(key);
              doctorMap.set(key, { ...existing, ...d });
            }
          });
          
          return Array.from(doctorMap.values());
        });

        if (currentDoctor) {
          const updatedSelf = incoming.find((d: any) => 
            d.id === (currentDoctor.id || currentDoctor._id) || 
            (d.email && d.email.toLowerCase() === currentDoctor.email.toLowerCase())
          );
          if (updatedSelf) {
            const hasChanged = JSON.stringify(updatedSelf) !== JSON.stringify(currentDoctor);
            if (hasChanged) {
              setCurrentDoctor(updatedSelf);
              localStorage.setItem('doctor_user', JSON.stringify(updatedSelf));
            }
          }
        }
      }
      
      // Sync Patients
      if (patientsRes.data && Array.isArray(patientsRes.data)) {
        setPatients(prev => {
          const incoming = patientsRes.data.map((p: any) => ({ ...p, id: p.id || p._id }));
          const patientMap = new Map();
          
          // 1. Seed with initial mock data
          initialPatients.forEach(p => {
            const key = p.email?.toLowerCase() || p.id;
            patientMap.set(key, { ...p, id: p.id || p._id });
          });

          // 2. Merge with prev
          prev.forEach(p => {
             const key = p.email?.toLowerCase() || p.id || p._id;
             if (key) patientMap.set(key, { ...patientMap.get(key), ...p });
          });
          
          // 3. Merge with incoming
          incoming.forEach(p => {
             const key = p.email?.toLowerCase() || p.id || p._id;
             if (key) {
               const existing = patientMap.get(key);
               patientMap.set(key, { ...existing, ...p });
             }
          });
          
          return Array.from(patientMap.values());
        });
      }

      // Sync Clinics
      if (clinicsRes.data && Array.isArray(clinicsRes.data)) {
        const liveClinics = clinicsRes.data;
        const mergedClinics = [...initialClinics];
        liveClinics.forEach((lc: any) => {
          const lcId = lc.id || lc._id;
          if (!mergedClinics.find(mc => mc.id === lcId)) {
            mergedClinics.push({ ...lc, id: lcId });
          }
        });
        setClinics(mergedClinics);
      }
    } catch (error) {
      console.warn('Backend offline or error fetching data. Maintaining local/mock state.');
      // If we are currently empty, re-seed with initial data as a fallback
      setDoctors(prev => prev.length > 0 ? prev : initialDoctors.map(d => ({ ...d, id: d.id || d._id })));
      setPatients(prev => prev.length > 0 ? prev : initialPatients.map(p => ({ ...p, id: p.id || p._id })));
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id: string) => {
    // Check if ID is likely a MongoDB ObjectID (24 hex chars)
    const isLocal = !/^[0-9a-fA-F]{24}$/.test(id);

    if (isLocal) {
      console.log('Removing local-only doctor record:', id);
      setDoctors(prev => prev.filter(d => (d._id !== id && d.id !== id)));
      toast.success('Doctor removed locally');
      return;
    }

    try {
      await api.delete(`/doctors/${id}`);
      setDoctors(prev => prev.filter(d => (d._id !== id && d.id !== id)));
      toast.success('Doctor permanently removed');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Could not delete doctor');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Data Persistence
  useEffect(() => {
    localStorage.setItem('clinic_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('clinic_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('clinic_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth Actions
  const login = async (credentials: any) => {
    try {
      const res = await api.post('/auth/login', credentials);
      setCurrentDoctor(res.data);
      localStorage.setItem('doctor_token', res.data.token);
      localStorage.setItem('doctor_user', JSON.stringify(res.data));
      await fetchData(); // Refresh data with auth context
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await api.post('/auth/register', userData);
      setCurrentDoctor(res.data);
      localStorage.setItem('doctor_token', res.data.token);
      localStorage.setItem('doctor_user', JSON.stringify(res.data));
      await fetchData(); 
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setCurrentDoctor(null);
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_user');
  };

  const loginClinic = async (credentials: ClinicLoginPayload) => {
    try {
      const res = await api.post('/auth/clinic/login', credentials);
      setCurrentClinic(res.data);
      localStorage.setItem('clinic_token', res.data.token);
      localStorage.setItem('clinic_user', JSON.stringify(res.data));
      await fetchData(); // Force refresh to load doctors/patients
    } catch (error) {
      throw error;
    }
  };

  const registerClinic = async (clinicData: ClinicRegisterPayload) => {
    try {
      const res = await api.post('/auth/clinic/register', clinicData);
      setCurrentClinic(res.data);
      localStorage.setItem('clinic_token', res.data.token);
      localStorage.setItem('clinic_user', JSON.stringify(res.data));
      await fetchData(); // Force refresh
    } catch (error) {
      throw error;
    }
  };

  const logoutClinic = () => {
    setCurrentClinic(null);
    localStorage.removeItem('clinic_token');
    localStorage.removeItem('clinic_user');
    window.location.href = '/clinic/login';
  };

  const updateClinic = async (updates: Partial<ClinicRegisterPayload>) => {
    if (!currentClinic?.id) return;
    try {
      const res = await api.patch(`/auth/clinic/${currentClinic.id}`, updates);
      setCurrentClinic(res.data);
      localStorage.setItem('clinic_user', JSON.stringify(res.data));
    } catch (error) {
      throw error;
    }
  };

  // --- PATIENT AUTH ---
  const loginPatient = async (credentials: PatientLoginPayload) => {
    try {
      const res = await api.post('/patients/login', credentials);
      setCurrentPatient(res.data);
      localStorage.setItem('patient_token', res.data.token);
      localStorage.setItem('patient_user', JSON.stringify(res.data));
    } catch (error) {
      throw error;
    }
  };

  const registerPatient = async (userData: PatientRegisterPayload) => {
    try {
      const res = await api.post('/patients/register', userData);
      setCurrentPatient(res.data);
      localStorage.setItem('patient_token', res.data.token);
      localStorage.setItem('patient_user', JSON.stringify(res.data));
    } catch (error) {
      throw error;
    }
  };

  const logoutPatient = () => {
    setCurrentPatient(null);
    localStorage.removeItem('patient_token');
    localStorage.removeItem('patient_user');
    window.location.href = '/patient/login';
  };

  const bookAppointment = async (data: AppointmentPayload) => {
    try {
      await api.post('/patients/appointments', data);
      
      // Notify the clinic if clinicId is present
      if (data.clinicId) {
        addNotification({
          title: "New Appointment Request",
          description: `A patient has requested a slot for ${data.date} at ${data.time}`,
          type: 'info',
          targetRole: 'clinic',
          clinicId: data.clinicId
        });

        // Notify the patient as well
        addNotification({
          title: "Appointment Requested",
          description: `Your appointment for ${data.date} at ${data.time} has been requested.`,
          type: 'success',
          targetRole: 'patient',
          patientId: data.patientId
        });
      }
      
      toast.success('Appointment booked successfully!');
      await fetchData();
    } catch (error) {
      throw error;
    }
  };

  const uploadPatientRecord = async (patientId: string, formData: FormData) => {
    try {
      await api.post(`/patients/${patientId}/records-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      addNotification({
        title: "Medical Record Uploaded",
        description: `New record has been successfully saved to your health timeline.`,
        type: 'success',
        targetRole: 'patient',
        patientId: patientId
      });
      
      toast.success('Medical record uploaded and saved!');
      await fetchData();
    } catch (error) {
      throw error;
    }
  };

  // Data Actions
  const addDoctor = async (doctorData: DoctorRegisterPayload) => {
    const dataWithClinic = {
      ...doctorData,
      clinicId: currentClinic?.id || 'none',
      clinicName: currentClinic?.name || 'Independent'
    };

    try {
      const res = await api.post('/doctors', dataWithClinic);
      setDoctors(prev => [{ ...res.data, id: res.data.id || res.data._id }, ...prev]);
      addNotification({
        title: "New Doctor Added",
        description: `${res.data.name} has joined the clinic.`,
        type: 'success',
        targetRole: 'clinic',
        clinicId: currentClinic?.id
      });
    } catch (error) {
      console.warn('Backend offline, adding doctor locally:', error);
      const mockDoctor = {
        name: doctorData.name || "Unknown Doctor",
        specialty: doctorData.specialty || "General",
        age: Number(doctorData.age) || 30,
        experience: Number(doctorData.experience) || 5,
        phone: doctorData.phone || "",
        email: doctorData.email || "",
        ...dataWithClinic,
        id: Math.random().toString(36).substring(2, 11),
        patientsToday: 0,
        completedOPs: 0,
        ongoingOPs: 0,
        totalHandled: 0,
        status: doctorData.status || 'available'
      };
      setDoctors(prev => [mockDoctor as Doctor, ...prev]);
      addNotification({
        title: "Doctor Added (Local Only)",
        description: `${mockDoctor.name} added to local session.`,
        type: 'warning',
        targetRole: 'clinic',
        clinicId: currentClinic?.id
      });
    }
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    try {
      const res = await api.patch(`/doctors/${id}`, updates);
      const updatedDoc = res.data;
      setDoctors(prev => prev.map(d => (d._id === id || d.id === id) ? updatedDoc : d));
      
      // Also update currentDoctor if it's the one logged in
      if (currentDoctor && (currentDoctor._id === id || currentDoctor.id === id)) {
        const newCurrentDoc = { ...currentDoctor, ...updatedDoc };
        setCurrentDoctor(newCurrentDoc);
        localStorage.setItem('doctor_user', JSON.stringify(newCurrentDoc));
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating doctor:', error);
      // Fallback to local update
      setDoctors(prev => prev.map(d => (d._id === id || d.id === id) ? { ...d, ...updates } : d));
      
      if (currentDoctor && (currentDoctor._id === id || currentDoctor.id === id)) {
        const newCurrentDoc = { ...currentDoctor, ...updates };
        setCurrentDoctor(newCurrentDoc as Doctor);
        localStorage.setItem('doctor_user', JSON.stringify(newCurrentDoc));
      }
      toast.warning("Saved locally (Sync error)");
    }
  };

  const toggleDoctorStatus = async (id: string) => {
    const doctor = doctors.find(d => d._id === id || d.id === id);
    if (!doctor) return;
    
    const statuses: Doctor['status'][] = ['available', 'busy', 'break'];
    const nextStatus = statuses[(statuses.indexOf(doctor.status) + 1) % statuses.length];
    
    await updateDoctor(id, { status: nextStatus });
    
    addNotification({
      title: "Status Changed",
      description: `${doctor.name} is now ${nextStatus.toUpperCase()}.`,
      type: 'info',
      targetRole: 'clinic',
      clinicId: doctor.clinicId
    });
  };

  const addPatient = async (patientData: Partial<Patient>) => {
    const dataWithClinic = {
      ...patientData,
      clinicId: currentClinic?.id || 'none'
    };

    try {
      const res = await api.post('/patients', dataWithClinic);
      setPatients(prev => [{ ...res.data, id: res.data.id || res.data._id }, ...prev]);
      addNotification({
        title: "New Patient Registered",
        description: `${res.data.name} has been added to the system.`,
        type: 'success',
        targetRole: 'clinic',
        clinicId: currentClinic?.id
      });
    } catch (error) {
      console.warn('Backend offline, adding patient locally:', error);
      const mockPatient = {
        name: patientData.name || "New Patient",
        age: Number(patientData.age) || 0,
        gender: patientData.gender || "M",
        phone: patientData.phone || "",
        email: patientData.email || "",
        bloodGroup: patientData.bloodGroup || "O+",
        medicalHistory: patientData.medicalHistory || "",
        assignedDoctor: patientData.assignedDoctor || "",
        ...dataWithClinic,
        id: `local-${Math.random().toString(36).substring(2, 11)}`,
        token: `#${Math.floor(Math.random() * 50).toString().padStart(2, '0')}`,
        status: 'waiting',
        lastVisit: new Date().toLocaleDateString(),
        opRecords: []
      };
      setPatients(prev => [mockPatient as Patient, ...prev]);
      addNotification({
        title: "Patient Added (Local Only)",
        description: `${mockPatient.name} added to local session.`,
        type: 'warning',
        targetRole: 'clinic',
        clinicId: currentClinic?.id
      });
    }
  };

  /* 
     Helper to ensure a patient exists in the backend DB.
     If the patient only has a local ID, they are promoted to the cloud.
  */
  const promotePatientToDB = async (localId: string): Promise<string> => {
    let latestPatient: Patient | undefined;
    
    setPatients(prev => {
      latestPatient = prev.find(p => p.id === localId || p._id === localId);
      return prev;
    });

    if (!latestPatient || !localId.startsWith('local-')) return localId;

    try {
      console.log(`Promoting local patient ${localId} to cloud database...`);
      const { id, _id, ...patientData } = latestPatient as Patient;
      const res = await api.post('/patients', patientData);
      const newDbPatient = { ...res.data, id: res.data.id || res.data._id };
      
      setPatients(prev => prev.map(p => (p.id === localId || p._id === localId) ? newDbPatient : p));
      
      return newDbPatient.id || newDbPatient._id;
    } catch (error) {
      console.warn('Failed to promote patient to database. Still in local-mode.');
      return localId;
    }
  };

  const updatePatientStatus = async (patientId: string, status: Patient['status']) => {
    const realId = await promotePatientToDB(patientId);
    try {
      await api.patch(`/patients/${realId}/status`, { status });
      setPatients(prev => prev.map(p => (p._id === realId || p.id === realId) ? { ...p, status } : p));
    } catch (error) {
      console.error('Error updating patient status:', error);
    }
  };

  const startOP = async (patientId: string) => {
    try {
      // Set patient to ongoing
      await updatePatientStatus(patientId, 'consultation');
      
      // Update current doctor status to busy if possible
      if (currentDoctor) {
        await updateDoctor((currentDoctor._id || currentDoctor.id), { status: 'busy' });
      }
      
      await fetchData(); // Comprehensive sync
    } catch (error) {
      console.error('Error starting OP:', error);
    }
  };

  const completeOP = async (patientId: string, record: any) => {
    try {
      // 1. Perform API call
      const res = await api.post(`/patients/${patientId}/records`, record);
      const updatedPatientFromDB = res.data;
      
      // 2. Compute updated patients list first for immediate local logic
      const updatedPatientsArray = patients.map(p => 
        p._id === patientId || p.id === patientId 
          ? { ...updatedPatientFromDB, status: 'completed', lastVisit: new Date().toLocaleDateString() } 
          : p
      );
      
      // 3. Apply the state update
      setPatients(updatedPatientsArray);

      // 4. Update local doctor state using the newly computed array logic
      if (currentDoctor) {
        // Find next patient in the fresh array
        const remainingPatients = updatedPatientsArray.filter(p => 
          (p.assignedDoctor === currentDoctor?.name || p.assignedDoctorId === currentDoctor?._id) && 
          p.status === 'waiting'
        );
        
        const nextToken = remainingPatients.length > 0 ? remainingPatients[0].token : "None";

        const updatedDoc: Doctor = {
          ...currentDoctor,
          completedOPs: (currentDoctor.completedOPs || 0) + 1,
          status: 'available',
          currentToken: nextToken
        };
        setCurrentDoctor(updatedDoc);
        localStorage.setItem('doctor_user', JSON.stringify(updatedDoc));
      }
      
      // 4. Trigger background sync to ensure absolute consistency
      await fetchData();

      addNotification({
        title: "Checkup Completed",
        description: `OP record saved for ${updatedPatientFromDB.name}.`,
        type: 'success',
        targetRole: 'doctor',
        clinicId: currentDoctor?.clinicId,
        doctorId: (currentDoctor?._id || currentDoctor?.id)
      });
    } catch (error) {
      console.error('Error completing OP:', error);
      toast.error("Cloud synchronization failed. Please check connection.");
    }
  };



  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 11),
      time: "Just now",
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <AppContext.Provider value={{ 
      doctors, 
      patients, 
      clinics,
      notifications, 
      currentDoctor,
      currentClinic,
      currentPatient,
      loading,
      login,
      logout,
      loginClinic,
      registerClinic,
      logoutClinic,
      loginPatient,
      registerPatient,
      logoutPatient,
      fetchData,
      addDoctor, 
      updateDoctor, 
      toggleDoctorStatus,
      addPatient,
      addNotification,
      markNotificationAsRead,
      completeOP,
      startOP,
      updatePatientStatus,
      deleteDoctor,
      updateClinic,
      bookAppointment,
      uploadPatientRecord,
      register
    }}>

      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppContextProvider');
  return context;
};
