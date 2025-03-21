import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import saleRoutes from './routes/sale.routes.js'
import { connectDB } from './db.js';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url'
import path from 'path'

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname,'public')))

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())

app.use(productRoutes)
app.use(userRoutes)
app.use(saleRoutes)

connectDB();
app.listen(8080, console.log('Server corriendo en el puerto 8080'))