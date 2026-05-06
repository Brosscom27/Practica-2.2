import { Product } from '../models/Product.js';
import { Movement } from '../models/Movement.js';

export const stockReport = async (req, res, next) => {
  try {
    const data = await Product.find({ isActive: true }).select('name currentStock minStock maxStock cost').sort({ name: 1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const lowStockReport = async (req, res, next) => {
  try {
    const data = await Product.find({ isActive: true, $expr: { $lte: ['$currentStock', '$minStock'] } })
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

export const topSales = async (req, res, next) => {
  try {
    const data = await Movement.aggregate([
      { $match: { type: 'salida' } },
      { $group: { _id: '$product', total: { $sum: '$quantity' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productInfo' } },
      { $unwind: '$productInfo' },
      { $project: { name: '$productInfo.name', total: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const warehouseDistribution = async (req, res, next) => {
  try {
    const data = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$warehouse', totalItems: { $sum: '$currentStock' } } },
      { $lookup: { from: 'warehouses', localField: '_id', foreignField: '_id', as: 'warehouseInfo' } },
      { $unwind: '$warehouseInfo' },
      { $project: { name: '$warehouseInfo.name', value: '$totalItems' } }
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
