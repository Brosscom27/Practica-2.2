import { Warehouse } from '../models/Warehouse.js';

export const listWarehouses = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const query = { isActive: true };

    if (search) query.name = { $regex: search, $options: 'i' };

    let warehousesQuery = Warehouse.find(query).sort({ name: 1 });

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      warehousesQuery = warehousesQuery.skip(skip).limit(Number(limit));
    }

    const warehouses = await warehousesQuery;
    const total = await Warehouse.countDocuments(query);

    if (page && limit) {
      res.json({ data: warehouses, total, page: Number(page), limit: Number(limit) });
    } else {
      res.json(warehouses);
    }
  } catch (err) {
    next(err);
  }
};

export const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
  } catch (err) {
    next(err);
  }
};

export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(warehouse);
  } catch (err) {
    next(err);
  }
};

export const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json({ message: 'Almacén eliminado logicamente', warehouse });
  } catch (err) {
    next(err);
  }
};
