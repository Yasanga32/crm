const express = require('express');
const {
  getNotesByLead,
  createNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/:leadId').get(protect, getNotesByLead).post(protect, createNote);
router.route('/note/:id').delete(protect, deleteNote);

module.exports = router;
