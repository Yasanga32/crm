import mongoose from 'mongoose';

const leadSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: 'New' },
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
