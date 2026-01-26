import { Router } from "express";
import { DashboardController } from "../controller/dashboard-controller";
import { adminAuth, userAuth } from "../middleware/auth-middleware";

const dashboardRouter = Router();
dashboardRouter.get(
  "/admin/dashboard",
  adminAuth,
  DashboardController.getAdminDashboard,
);

// dashboardRouter.get(
//   "/user/dashboard",
//   userAuth,
//   DashboardController.getUserDashboard,
// );

export default dashboardRouter;
