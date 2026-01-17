import { Router } from "express";
import { FactController } from "../controller/fact-controller";

const factRouter = Router();
factRouter.post("/", FactController.create);
factRouter.get("/", FactController.getList);
factRouter.get("/:id", FactController.getDetail);
factRouter.put("/", FactController.update);
factRouter.delete("/:id", FactController.delete);
factRouter.get("/options/list", FactController.getOptions);

export default factRouter;
