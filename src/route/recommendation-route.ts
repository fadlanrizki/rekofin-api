import { RecommendationController } from "../controller/recommendation-controller";
import { Router } from "express";
import { adminAuth } from "../middleware/auth-middleware";

const recommendationRouter = Router();
recommendationRouter.post("/", adminAuth, RecommendationController.create);
recommendationRouter.get("/", adminAuth, RecommendationController.getList);
recommendationRouter.get("/:id", adminAuth, RecommendationController.findById);
recommendationRouter.delete("/:id", adminAuth, RecommendationController.delete);
recommendationRouter.put("/", adminAuth, RecommendationController.update);

export default recommendationRouter;
