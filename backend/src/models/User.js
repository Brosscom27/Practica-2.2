import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'encargado', 'consultor'],
      default: 'consultor'
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
