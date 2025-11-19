import { FinancialController } from "../controller/financial-controller";
import { Router } from "express";

const financialRouter = Router();
financialRouter.post("/", FinancialController.create);

export default financialRouter;
