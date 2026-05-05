import mongoose from 'mongoose';

const noteSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;
