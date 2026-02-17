import { NextFunction, Request, Response } from "express";
import { SourceService } from "../service/source-service";

export class SourceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.create(req);
      res.status(200).json({
        ok: true,
        data: result,
        message: "Berhasil Menambahkan Source",
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.update(req.body);
      res.status(200).json({
        ok: true,
        data: result,
        message: "Berhasil Edit Source",
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await SourceService.delete(req);
      res.status(200).json({
        ok: true,
        message: "Berhasil Delete Source",
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.get(req);
      res.status(200).json({
        ok: true,
        data: result,
        message: "Berhasil Get Data Source",
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SourceService.list(req);
      res.status(200).json({
        ok: true,
        ...result,
        message: "Berhasil Get List Source",
      });
    } catch (e) {
      next(e);
    }
  }
}
