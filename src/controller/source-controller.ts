import { NextFunction, Request, Response } from "express";
import { SourceService } from "../service/source-service";

export class SourceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.create(req);
      res.status(200).json({
        data: result,
        message: "Source created successfully",
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.update(req);
      res.status(200).json({
        data: result,
        message: "Source updated successfully",
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await SourceService.delete(req);
      res.status(200).json({
        message: "Source deleted successfully",
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.get(req);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.list(req);
      res.status(200).json({
        data: result.data,
        paging: result.paging,
      });
    } catch (e) {
      next(e);
    }
  }
}
