import mongoose from 'mongoose';

const scamReportSchema = new mongoose.Schema({
  recruiterName: { type: String, required: true },
  issue: { type: String, required: true },
  reportCount: { type: Number, default: 1 },
  location: { type: String },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { timestamps: true });

const ScamReport = mongoose.model('ScamReport', scamReportSchema);
export default ScamReport;
