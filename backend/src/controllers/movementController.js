import { Movement } from '../models/Movement.js';
import { registerMovement } from '../services/inventoryService.js';

export const createMovement = async (req, res, next) => {
  try {
    const result = await registerMovement({
      productId: req.body.productId,
      type: req.body.type,
      quantity: Number(req.body.quantity),
      userId: req.user.sub
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const movementHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, productId } = req.query;
    const query = {};

    if (productId) query.product = productId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const movements = await Movement.find(query)
      .populate('product', 'name')
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.json(movements);
  } catch (err) {
    next(err);
  }
};
