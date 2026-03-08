import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true }
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, warehouse: 1 }, { unique: true });

export const Category = mongoose.model('Category', categorySchema);
