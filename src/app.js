import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

export default app;