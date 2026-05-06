import { Product } from '../models/Product.js';
import { Movement } from '../models/Movement.js';
import { HttpError } from '../utils/httpError.js';

export const registerMovement = async ({ productId, type, quantity, userId, reason, clientFolio }) => {
  const product = await Product.findById(productId);
  if (!product) throw new HttpError(404, 'Producto no encontrado');

  const delta = type === 'entrada' ? quantity : -quantity;
  const newStock = product.currentStock + delta;

  if (newStock < 0) throw new HttpError(400, 'No hay stock suficiente para salida');

  product.currentStock = newStock;
  await product.save();

  // Calcular el valor total del movimiento (incluyendo impuestos si aplica)
  const taxMultiplier = 1 + (product.taxRate || 0) / 100;
  const totalValue = quantity * (product.cost || 0) * taxMultiplier;

  const movement = await Movement.create({
    product: product._id,
    type,
    quantity,
    reason,
    clientFolio,
    totalValue,
    user: userId
  });

  const lowStock = product.currentStock <= product.minStock;

  return {
    movement,
    product,
    lowStock
  };
};
