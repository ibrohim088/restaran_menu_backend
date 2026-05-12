import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ensureDir = (folder) => {
  const dir = path.join(__dirname, '../../uploads', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, ensureDir(folder)),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Faqat jpg, jpeg, png, webp rasmlar ruxsat etilgan!'));
  }
};

export const upload = multer({
  storage: createStorage('images'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadRestaurantImages = multer({
  storage: createStorage('images'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);
