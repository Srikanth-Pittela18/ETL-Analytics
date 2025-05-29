import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
 
dotenv.config();
 
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
 
app.use('/auth', authRoutes);
 
export default app;