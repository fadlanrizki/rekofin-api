import { RuleController } from "./../controller/rule-controller";
import { Router } from "express";

const ruleRouter = Router();
ruleRouter.post("/", RuleController.create);
ruleRouter.put("/", RuleController.update);
ruleRouter.get("/", RuleController.getList);
ruleRouter.get("/:id", RuleController.findById);
ruleRouter.delete("/:id", RuleController.delete);

export default ruleRouter;
