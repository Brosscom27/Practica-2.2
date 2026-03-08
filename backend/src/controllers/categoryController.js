import { Category } from '../models/Category.js';

export const listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('warehouse', 'name');
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};
