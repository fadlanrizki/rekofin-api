import { Request, Response, NextFunction } from "express";
import {
  TAddRecommendation,
  TEditRecommendation,
} from "../types/api/recommendation";
import { RecommendationService } from "../service/recommendation-service";
import { TGetList } from "../types/api/common";

export class RecommendationController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TAddRecommendation;
      const response = await RecommendationService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan Recommendation",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TEditRecommendation;
      const response = await RecommendationService.update(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Edit Recommendation",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TGetList;

      const response = await RecommendationService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil Get List Recommendation",
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await RecommendationService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Get data Recommendation`,
      });
    } catch (error) {
      next(error);
    }
  }
}
