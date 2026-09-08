import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, default: 'Manager', trim: true },
    status: { type: String, required: true, default: 'Active', trim: true },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);