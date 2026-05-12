import Joi from 'joi';
import { validate } from './authValidator.js';

const menuItemCreateSchema = Joi.object({
  categoryId: Joi.string().required().messages({ 'any.required': 'categoryId majburiy' }),
  name: Joi.string().required().messages({ 'any.required': 'Taom nomi majburiy' }),
  price: Joi.number().min(0).required().messages({ 'any.required': 'Narx majburiy' }),
  description: Joi.string().allow(''),
  weight: Joi.string().allow(''),
  calories: Joi.string().allow(''),
  isAvailable: Joi.boolean(),
  isPopular: Joi.boolean(),
  orderIndex: Joi.number().default(0),
});

const menuItemUpdateSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number().min(0),
  description: Joi.string().allow(''),
  weight: Joi.string().allow(''),
  calories: Joi.string().allow(''),
  isAvailable: Joi.boolean(),
  isPopular: Joi.boolean(),
  orderIndex: Joi.number(),
});

export const validateCreateMenuItem = validate(menuItemCreateSchema);
export const validateUpdateMenuItem = validate(menuItemUpdateSchema);
