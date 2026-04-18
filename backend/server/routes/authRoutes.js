import express from 'express';
import { 
  loginDoctor, 
  registerDoctor, 
  loginClinic, 
  registerClinic,
  updateClinic,
  getAllClinics
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginDoctor);
router.post('/register', registerDoctor);
router.post('/clinic/login', loginClinic);
router.post('/clinic/register', registerClinic);
router.get('/clinics', getAllClinics);
router.patch('/clinic/:id', updateClinic);

export default router;
