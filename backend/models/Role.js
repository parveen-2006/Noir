import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: 'Custom role.', trim: true },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Role', roleSchema);