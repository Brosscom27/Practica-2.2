import { Product } from '../models/Product.js';
import { Movement } from '../models/Movement.js';

export const stockReport = async (req, res, next) => {
  try {
    const data = await Product.find().select('name currentStock minStock maxStock').sort({ name: 1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const lowStockReport = async (req, res, next) => {
  try {
    const data = await Product.find({ $expr: { $lte: ['$currentStock', '$minStock'] } })
      .select('name currentStock minStock');
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const movementsReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const data = await Movement.find(query).populate('product', 'name').populate('user', 'name');
    res.json(data);
  } catch (err) {
    next(err);
  }
};
