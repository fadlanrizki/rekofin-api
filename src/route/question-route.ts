import { Router } from "express";
import { QuestionController } from "../controller/question-contoller";

const questionRouter = Router();
questionRouter.post("/", QuestionController.create);
questionRouter.get("/", QuestionController.getList);

export default questionRouter;
