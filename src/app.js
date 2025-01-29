import express from 'express'

import userRoutes from './routes/user.routes.js'
import { connectDB } from './db.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(userRoutes)

connectDB();
app.listen(8080, console.log('Server corriendo en el puerto 8080'))