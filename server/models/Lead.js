import mongoose from 'mongoose';

const leadSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    status: { 
      type: String, 
      default: 'New',
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
    },
    source: { type: String, default: 'Web' },
    value: { type: Number, default: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
