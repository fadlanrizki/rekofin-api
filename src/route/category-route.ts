import { Router } from "express";
import { CategoryController } from "../controller/category-controller";
import { adminAuth } from "../middleware/auth-middleware";

const categoryRouter = Router();
categoryRouter.post("/", adminAuth, CategoryController.create);
categoryRouter.put("/", adminAuth, CategoryController.update);
categoryRouter.get("/", adminAuth, CategoryController.getList);
categoryRouter.get("/:id", adminAuth, CategoryController.findById);
categoryRouter.delete("/:id", adminAuth, CategoryController.delete);

export default categoryRouter;
