import { Category } from '../models/Category.js';
import { Warehouse } from '../models/Warehouse.js';

const defaults = [
  { name: 'Bebidas', categories: ['Cerveza', 'Vinos y licores'] },
  { name: 'Comida', categories: ['Salsas', 'Latas', 'Papas', 'Verduras'] },
  { name: 'Refrigeración', categories: ['Perecederos'] },
  { name: 'Limpieza', categories: ['General'] },
  { name: 'Mantenimiento', categories: ['General'] },
  { name: 'Vajilla', categories: ['General'] },
  { name: 'Desechos', categories: ['General'] }
];

export const seedDefaults = async () => {
  for (const item of defaults) {
    let warehouse = await Warehouse.findOne({ name: item.name });
    if (!warehouse) {
      warehouse = await Warehouse.create({
        name: item.name,
        description: `Almacén de ${item.name}`,
        predefined: true
      });
    }

    for (const catName of item.categories) {
      const exists = await Category.findOne({ name: catName, warehouse: warehouse._id });
      if (!exists) {
        await Category.create({ name: catName, warehouse: warehouse._id });
      }
    }
  }
};
