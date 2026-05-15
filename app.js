import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './src/shared/config.js';
import db from './src/db/index.js';
import errorHandler from './src/middleware/erorrHandler.js';
import { setupSwagger } from './swagger.js';

import adminRouter from './src/router/admin.js';
import authRouter from './src/router/auth.js';
import menuRouter from './src/router/menu.js';
import categoryRouter from './src/router/category.js';
import restaranRouter from './src/router/restaran.js';
import publicRoutes from './src/router/public.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    config.NETWORK_URL,
    config.BASE_URL,
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRouter);
app.use('/menu', menuRouter);
app.use('/admins', adminRouter);
app.use('/public', publicRoutes);
app.use('/restaran', restaranRouter);
app.use('/categories', categoryRouter);

app.use(errorHandler);
setupSwagger(app);

db();

if (process.env.NODE_ENV !== 'production') {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`Network URL: ${config.NETWORK_URL}`);
    console.log('');

  });
}

export default app;