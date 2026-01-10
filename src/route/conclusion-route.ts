import { Router } from "express";
import { ConclusionController } from "../controller/conclusion-controller";

const conclusionRouter = Router();
conclusionRouter.post("/", ConclusionController.create);
conclusionRouter.get("/", ConclusionController.getList);

export default conclusionRouter;
