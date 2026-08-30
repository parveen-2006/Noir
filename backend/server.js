import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDatabase from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

connectDatabase();
