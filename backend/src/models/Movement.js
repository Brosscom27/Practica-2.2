import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['entrada', 'salida'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, default: 'Ajuste' },
    clientFolio: { type: String },
    totalValue: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Movement = mongoose.model('Movement', movementSchema);
