import { Router } from "express";
import { DashboardController } from "../controller/dashboard-controller";
import { adminAuth, userAuth } from "../middleware/auth-middleware";

const dashboardRouter = Router();
dashboardRouter.get(
  "/dashboard/admin",
  adminAuth,
  DashboardController.getAdminDashboard,
);

dashboardRouter.get(
  "/dashboard/user",
  userAuth,
  DashboardController.getUserDashboard,
);

export default dashboardRouter;
