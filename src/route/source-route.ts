import express from "express";
import { SourceController } from "../controller/source-controller";

const sourceRouter = express.Router();

sourceRouter.post("/", SourceController.create);
sourceRouter.put("/", SourceController.update);
sourceRouter.delete("/:id", SourceController.delete);
sourceRouter.get("/options", SourceController.getOptions);
sourceRouter.get("/", SourceController.list);
sourceRouter.get("/:id", SourceController.getDetail);

export default sourceRouter;
