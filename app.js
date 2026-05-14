import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { setupSwagger } from './swagger.js'
import path from 'path'

import db from './src/db/index.js'
import config from './src/shared/config.js'
import errorHandler from './src/middleware/erorrHandler.js';

import adminRouter from './src/router/admin.js'
import authRouter from './src/router/auth.js'
import menuRouter from './src/router/menu.js'
import categoryRouter from './src/router/category.js'
import restaranRouter from './src/router/restaran.js'
import publicRoutes from './src/router/public.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
// app.use(cors('http://localhost:5173/'))

app.use(cors({
  origin: true, // yoki aniq frontend URL
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRouter)
app.use('/menu', menuRouter)
app.use('/admins', adminRouter)
app.use('/public', publicRoutes);
app.use('/restaran', restaranRouter)
app.use('/categories', categoryRouter)

app.use(errorHandler);
setupSwagger(app)

db()
// app.listen(config.PORT, () => {
//   console.log(`Server is running at port: ${config.PORT}`);
// })

export default app;