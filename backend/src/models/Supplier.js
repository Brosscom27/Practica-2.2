import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    classification: { type: String, required: true },
    contactInfo: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Supplier = mongoose.model('Supplier', supplierSchema);
