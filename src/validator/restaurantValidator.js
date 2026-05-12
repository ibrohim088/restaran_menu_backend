import Joi from 'joi';
import { validate } from './authValidator.js';

const restaurantCreateSchema = Joi.object({
  name: Joi.string().min(2).required().messages({ 'any.required': 'Restoran nomi majburiy' }),
  address: Joi.string().required().messages({ 'any.required': 'Manzil majburiy' }),
  description: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  instagram: Joi.string().allow(''),
  telegram: Joi.string().allow(''),
  website: Joi.string().allow(''),
  workingHours: Joi.string().allow(''),
});

const restaurantUpdateSchema = Joi.object({
  name: Joi.string().min(2),
  address: Joi.string(),
  description: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  instagram: Joi.string().allow(''),
  telegram: Joi.string().allow(''),
  website: Joi.string().allow(''),
  workingHours: Joi.string().allow(''),
  isActive: Joi.boolean(),
});

export const validateCreateRestaurant = validate(restaurantCreateSchema);
export const validateUpdateRestaurant = validate(restaurantUpdateSchema);
