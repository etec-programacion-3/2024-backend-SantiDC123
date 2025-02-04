import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import { connectDB } from './db.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())

app.use(productRoutes)
app.use(userRoutes)

connectDB();
app.listen(8080, console.log('Server corriendo en el puerto 8080'))