import { Product } from '../models/Product.js';

export const listProducts = async (req, res, next) => {
  try {
    const { search, warehouse, category, barcode } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (warehouse) query.warehouse = warehouse;
    if (category) query.category = category;
    if (barcode) query.barcode = barcode;

    const products = await Product.find(query)
      .populate('warehouse', 'name')
      .populate('category', 'name')
      .sort({ name: 1 });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};
