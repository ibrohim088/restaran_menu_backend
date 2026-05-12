import mongoose from 'mongoose';
import config from '../shared/config.js';

export default function db() {
  return mongoose.connect(config.DB_URL)
    .then(() => console.log('DB connected successfully'))
    .catch((err) => console.error('DB connection error:', err.message));
}
