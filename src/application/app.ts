import express from "express";
import cors from "cors";
import authRouter from "../route/auth.route";
import { errorMiddleware } from "../middleware/error-middleware";
import { authenticateToken } from "../middleware/auth-middleware";
import userRouter from "../route/user-route";
import recommendationRouter from "../route/recommendation-route";
import ruleRouter from "../route/rule-route";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", authenticateToken, userRouter);
app.use("/api/rule", authenticateToken, ruleRouter);
app.use("/api/recommendation", authenticateToken, recommendationRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});

export default app;
