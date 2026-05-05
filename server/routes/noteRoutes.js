import express from 'express';
import {
  getNotesByLead,
  createNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/:leadId').get(protect, getNotesByLead).post(protect, createNote);
router.route('/note/:id').delete(protect, deleteNote);

export default router;
