import { Router } from "express";
import { ConclusionController } from "../controller/conclusion-controller";

const conclusionRouter = Router();
conclusionRouter.post("/", ConclusionController.create);
conclusionRouter.get("/", ConclusionController.getList);
conclusionRouter.get("/:id", ConclusionController.getDetail);
conclusionRouter.put("/", ConclusionController.update);
conclusionRouter.delete("/:id", ConclusionController.delete);
conclusionRouter.get("/options/list", ConclusionController.getOptions);

export default conclusionRouter;
