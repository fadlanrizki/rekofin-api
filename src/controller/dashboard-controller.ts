import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../service/dashboard-service";

export class DashboardController {
  static async getAdminDashboard(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await DashboardService.getAdminDashboard();
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Mengambil data dashboard",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserDashboard(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await DashboardService.getUserDashboard();
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Mengambil data dashboard",
      });
    } catch (error) {
      next(error);
    }
  }
}
