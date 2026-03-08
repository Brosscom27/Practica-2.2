import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    provider: String,
    barcode: String,
    unit: { type: String, required: true },
    minStock: { type: Number, default: 0 },
    maxStock: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    location: String
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
