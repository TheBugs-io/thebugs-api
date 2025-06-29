import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import reservasRoute from './routes/reservaRoutes.js';
import userRoutes from './routes/userRoutes.js'

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/reservas', reservasRoute);
app.use('/users', userRoutes);

export default app;