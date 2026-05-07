import express from 'express';
import {
  getNotesByLead,
  createNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/:id').get(protect, getNotesByLead).post(protect, createNote);
router.route('/:id/delete').delete(protect, deleteNote);

export default router;
