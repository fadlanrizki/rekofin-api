import express from 'express';
import cors from 'cors';
import authRouter from '../routes/auth.route';
// import userRouter from './routes/user.route';

const PORT = process.env.PORT || 5000;



const app = express();
app.use(cors());
app.use(express.json());

// Route utama
// app.use('/api/users', userRouter);

app.use('/api/auth', authRouter)




app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});

export default app;
