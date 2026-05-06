import { Product } from '../models/Product.js';

export const listProducts = async (req, res, next) => {
  try {
    const { search, warehouse, category, barcode, page, limit } = req.query;
    const query = { isActive: true };

    if (search) query.name = { $regex: search, $options: 'i' };
    if (warehouse) query.warehouse = warehouse;
    if (category) query.category = category;
    if (barcode) query.barcode = barcode;

    let productsQuery = Product.find(query)
      .populate('warehouse', 'name')
      .populate('category', 'name')
      .populate('supplier', 'name classification')
      .sort({ name: 1 });

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      productsQuery = productsQuery.skip(skip).limit(Number(limit));
    }

    const products = await productsQuery;
    const total = await Product.countDocuments(query);

    // If page and limit are provided return object, otherwise array (for backward compatibility during migration)
    if (page && limit) {
      res.json({ data: products, total, page: Number(page), limit: Number(limit) });
    } else {
      res.json(products);
    }
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

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json({ message: 'Producto eliminado logicamente', product });
  } catch (err) {
    next(err);
  }
};
