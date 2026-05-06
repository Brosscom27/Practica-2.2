import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    type: { type: String, enum: ['directo', 'indirecto'], default: 'directo' },
    unitsPerPackage: { type: Number, default: 1 },
    area: { type: String, default: 'General' },
    preparationTime: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    barcode: String,
    unit: { type: String, required: true },
    cost: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    minStock: { type: Number, default: 0 },
    maxStock: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    location: String
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
