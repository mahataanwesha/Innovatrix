import mongoose from 'mongoose';

const verifiedRecruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  emailDomain: { type: String, required: true, unique: true },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const VerifiedRecruiter = mongoose.model('VerifiedRecruiter', verifiedRecruiterSchema);
export default VerifiedRecruiter;
