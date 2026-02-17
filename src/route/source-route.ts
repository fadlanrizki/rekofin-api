import express from "express";
import { SourceController } from "../controller/source-controller";

const sourceRouter = express.Router();

sourceRouter.post("/", SourceController.create);
sourceRouter.put("/", SourceController.update);
sourceRouter.delete("/:id", SourceController.delete);
sourceRouter.get("/:id", SourceController.get);
sourceRouter.get("/", SourceController.list);

export default sourceRouter;
