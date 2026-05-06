import { Supplier } from '../models/Supplier.js';

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({ isActive: true }).sort({ name: 1 });
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const { name, classification, contactInfo } = req.body;
    const newSupplier = await Supplier.create({ name, classification, contactInfo });
    res.status(201).json(newSupplier);
  } catch (err) {
    next(err);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Supplier.findByIdAndUpdate(id, { isActive: false });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
