import jwt from 'jsonwebtoken';
import config from '../shared/config.js';

const generateToken = (user, secret, expiresIn = config.JWT_EXPIRES_IN) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role 
    },
    secret || config.JWT_SECRET_KEY,
    { expiresIn }   // default 1 soat
  );
};

export default generateToken;