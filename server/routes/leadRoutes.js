import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { getNotesByLead, createNote } from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(protect, getLeads).post(protect, createLead);
router
  .route('/:id')
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

router.route('/:id/notes')
  .get(protect, getNotesByLead)
  .post(protect, createNote);

export default router;
