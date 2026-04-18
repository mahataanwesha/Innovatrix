import mongoose from 'mongoose';

const scamSchema = new mongoose.Schema({
  recruiterName: { type: String, required: true },
  company: { type: String, required: true },
  reportsCount: { type: Number, default: 1 },
  flaggedReasons: [{ type: String }],
}, { timestamps: true });

const Scam = mongoose.model('Scam', scamSchema);
export default Scam;
