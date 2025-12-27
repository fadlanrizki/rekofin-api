import express from "express";
import cors from "cors";
import authRouter from "../route/auth-route";
import { errorMiddleware } from "../middleware/error-middleware";
import categoryRouter from "../route/category-route";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});

export default app;
