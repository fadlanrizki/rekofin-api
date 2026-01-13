import { Request, Response, NextFunction } from "express";
import { TAddConclusion, TEditConclusion } from "../types/api/conclusion";
import { TGetList } from "../types/api/common";
import { ConclusionService } from "../service/conclusion-service";

export class ConclusionController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TAddConclusion;
      const response = await ConclusionService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan Conclusion",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TEditConclusion;
      const response = await ConclusionService.update(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Edit Conclusion",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TGetList;

      const response = await ConclusionService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil Get List Conclusion",
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await ConclusionService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Get data Conclusion`,
      });
    } catch (error) {
      next(error);
    }
  }
}
