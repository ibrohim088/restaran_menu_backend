import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': "To'g'ri email kiriting",
    'any.required': 'Email majburiy',
  }),
  password: Joi.string().min(4).required().messages({
    'string.min': "Parol kamida 4 ta belgidan iborat bo'lishi kerak",
    'any.required': 'Parol majburiy',
  }),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({ 'any.required': 'Eski parol majburiy' }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
    'any.required': 'Yangi parol majburiy',
  }),
});

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(', '),
    });
  }
  next();
};
