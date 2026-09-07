import express from "express";
import cors from "cors";
import authRouter from "../route/auth-route";
import { errorMiddleware } from "../middleware/error-middleware";
import factRouter from "../route/fact-route";
import { adminAuth, userAuth } from "../middleware/auth-middleware";
import questionRouter from "../route/question-route";
import conclusionRouter from "../route/conclusion-route";
import recommendationRouter from "../route/recommendation-route";
import ruleRouter from "../route/rule-route";
import consultationRouter from "../route/consultation-route";
import userRouter from "../route/user-route";
import dashboardRouter from "../route/dashboard-route";
import sourceRouter from "../route/source-route";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use("/api/admin/facts", adminAuth, factRouter);
app.use("/api/admin/recommendations", adminAuth, recommendationRouter);
app.use("/api/admin/conclusions", adminAuth, conclusionRouter);
app.use("/api/admin/questions", adminAuth, questionRouter);
app.use("/api/admin/rules", adminAuth, ruleRouter);
app.use("/api/admin/sources", adminAuth, sourceRouter);
app.use("/api/user/consultations", userAuth, consultationRouter);
app.use("/api", dashboardRouter);

app.use(errorMiddleware);

export default app;
