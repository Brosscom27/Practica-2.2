import { body } from 'express-validator';

export const movementValidator = [
  body('productId').isMongoId().withMessage('productId inválido'),
  body('type').isIn(['entrada', 'salida']).withMessage('Tipo inválido'),
  body('quantity').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0')
];
