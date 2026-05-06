import Note from '../models/Note.js';

// @desc    Get notes for a lead
// @route   GET /api/leads/:id/notes
// @access  Private
export const getNotesByLead = async (req, res) => {
  try {
    const notes = await Note.find({ lead: req.params.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a note for a lead
// @route   POST /api/leads/:id/notes
// @access  Private
export const createNote = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Note content is required' });
  }

  try {
    const note = new Note({
      content,
      lead: req.params.id,
      createdBy: req.user._id,
    });

    const createdNote = await note.save();
    
    // Populate createdBy before sending response
    const populatedNote = await Note.findById(createdNote._id).populate('createdBy', 'name email');
    
    res.status(201).json(populatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/note/:id
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      // Check if user is the one who created the note
      if (note.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this note' });
      }

      await note.deleteOne();
      res.json({ message: 'Note removed' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
