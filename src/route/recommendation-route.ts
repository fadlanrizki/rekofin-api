import { Router } from "express";
import { RecommendationController } from "../controller/recommendation-controller";

const recommendationRouter = Router();
recommendationRouter.post("/", RecommendationController.create);
recommendationRouter.get("/", RecommendationController.getList);
recommendationRouter.get("/:id", RecommendationController.findById);
recommendationRouter.put("/", RecommendationController.update);
recommendationRouter.delete("/:id", RecommendationController.delete);

export default recommendationRouter;
