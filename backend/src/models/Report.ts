import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inputType: { type: String, enum: ['file', 'text', 'url', 'link', 'chat'], required: true },
  content: { type: String, required: true },
  trustScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Safe'], required: true },
  factors: [{ type: String }],
  recommendation: { type: String },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
