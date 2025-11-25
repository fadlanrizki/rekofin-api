import { RecommendationController } from "../controller/recommendation-controller";
import { Router } from "express";

const recommendationRouter = Router();
recommendationRouter.post("/", RecommendationController.create);
recommendationRouter.get("/", RecommendationController.getList);
recommendationRouter.get("/:id", RecommendationController.findById);
recommendationRouter.delete("/:id", RecommendationController.delete);
recommendationRouter.patch("/", RecommendationController.update);
recommendationRouter.get("/user/:id", RecommendationController.getRecommendationResult)

export default recommendationRouter;
