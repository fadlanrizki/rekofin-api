import { Router } from "express";
import { RecommendationController } from "../controller/recommendation-controller";

const recommendationRouter = Router();
recommendationRouter.post("/", RecommendationController.create);
recommendationRouter.get("/", RecommendationController.getList);

export default recommendationRouter;
