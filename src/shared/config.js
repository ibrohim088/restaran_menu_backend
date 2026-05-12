// import 'dotenv/config'
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env faylining to'liq yo'lini ko'rsating
// dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config()

export default {
  DB_URL: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT || 8000,
  JWT_SECRET_KEY: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
};
