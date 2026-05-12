import jwt from 'jsonwebtoken';
import config from '../shared/config.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Token topilmadi" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Yaroqsiz yoki muddati tugagan token" });
  }
};

const roleGuard = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Ushbu amalni bajarish uchun huquqingiz yo'q" });
    }
    next();
  };
};

export { verifyToken, roleGuard };
