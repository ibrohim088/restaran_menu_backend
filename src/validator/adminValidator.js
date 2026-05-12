import Joi from 'joi';
import { validate } from './authValidator.js';

const adminCreateSchema = Joi.object({
  fullName: Joi.string().min(2).required().messages({
    'any.required': 'Ism majburiy',
    'string.min': 'Ism kamida 2 ta harf',
  }),
  email: Joi.string().email().required().messages({
    'string.email': "To'g'ri email kiriting",
    'any.required': 'Email majburiy',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Parol kamida 6 ta belgi',
    'any.required': 'Parol majburiy',
  }),
});

const adminUpdateSchema = Joi.object({
  fullName: Joi.string().min(2),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  isActive: Joi.boolean(),
});

export const validateCreateAdmin = validate(adminCreateSchema);
export const validateUpdateAdmin = validate(adminUpdateSchema);
