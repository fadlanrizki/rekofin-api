import express from "express";
import cors from "cors";
import authRouter from "../route/auth-route";
import { errorMiddleware } from "../middleware/error-middleware";
import factRouter from "../route/fact-route";
import { adminAuth } from "../middleware/auth-middleware";
import questionRouter from "../route/question-route";
import conclusionRouter from "../route/conclusion-route";
import recommendationRouter from "../route/recommendation-route";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/facts", adminAuth, factRouter);
app.use("/api/admin/recommendations", adminAuth, recommendationRouter);
app.use("/api/admin/conclusions", adminAuth, conclusionRouter);
app.use("/api/admin/questions", adminAuth, questionRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});

export default app;
