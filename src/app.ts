import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route';

const app = express();
app.use(cors());
app.use(express.json());

// Route utama
app.use('/api/users', userRouter);

export default app;