import { Category } from '../models/Category.js';

export const listCategories = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const query = { isActive: true };

    if (search) query.name = { $regex: search, $options: 'i' };

    let categoryQuery = Category.find(query).populate('warehouse', 'name').sort({ name: 1 });

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      categoryQuery = categoryQuery.skip(skip).limit(Number(limit));
    }

    const categories = await categoryQuery;
    const total = await Category.countDocuments(query);

    if (page && limit) {
      res.json({ data: categories, total, page: Number(page), limit: Number(limit) });
    } else {
      res.json(categories);
    }
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

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json({ message: 'Categoría eliminada logicamente', category });
  } catch (err) {
    next(err);
  }
};
