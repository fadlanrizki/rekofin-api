import { Router } from "express";
import { FactController } from "../controller/fact-controller";

const factRouter = Router();
factRouter.post("/", FactController.create);
factRouter.get("/", FactController.getList);

export default factRouter;
