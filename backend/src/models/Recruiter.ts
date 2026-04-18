import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  emailDomain: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  submittedProof: { type: String }, // optional, for frontend display
}, { timestamps: true });

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;
