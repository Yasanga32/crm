import express from 'express';
import { loginUser, registerUser, getUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/', protect, getUsers);

export default router;
