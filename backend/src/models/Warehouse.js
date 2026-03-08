import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    predefined: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Warehouse = mongoose.model('Warehouse', warehouseSchema);
