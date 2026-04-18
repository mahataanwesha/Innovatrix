import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const collegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

collegeSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

collegeSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const College = mongoose.model('College', collegeSchema);
export default College;
