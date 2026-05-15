import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import { getNetworkURL } from '../db/network.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()

export default {
  DB_URL: process.env.MONGO_URL,
  
  BASE_URL: process.env.BASE_URL || getNetworkURL(process.env.PORT || 8000),
  LOCAL_URL: `http://localhost:${process.env.PORT || 8000}`,
  NETWORK_URL: getNetworkURL(process.env.PORT || 8000),

  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,

  PORT: process.env.PORT || 8000,

  JWT_SECRET_KEY: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

};
