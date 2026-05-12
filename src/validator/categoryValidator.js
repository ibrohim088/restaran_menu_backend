import Joi from 'joi';
import { validate } from './authValidator.js';

const categoryCreateSchema = Joi.object({
  restaurantId: Joi.string().required().messages({ 'any.required': 'restaurantId majburiy' }),
  name: Joi.string().min(1).required().messages({ 'any.required': 'Kategoriya nomi majburiy' }),
  description: Joi.string().allow(''),
  orderIndex: Joi.number().default(0),
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(1),
  description: Joi.string().allow(''),
  orderIndex: Joi.number(),
  isActive: Joi.boolean(),
});

export const validateCreateCategory = validate(categoryCreateSchema);
export const validateUpdateCategory = validate(categoryUpdateSchema);
