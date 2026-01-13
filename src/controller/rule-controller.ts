import { Request, Response, NextFunction } from "express";
import { RuleService } from "../service/rule-service";
import { TGetList } from "../types/api/common";
import { TEditRule } from "../types/api/rule";

export class RuleController {
  static async create(req: any, res: Response, next: NextFunction) {
    try {
      const request = req.body;
      const userId: number = req.user.id;
      const response = await RuleService.create(request, userId);

      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan Rule",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TEditRule;
      const response = await RuleService.update(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Edit Rule",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TGetList;

      const response = await RuleService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil Get List Rule",
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await RuleService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Get data Rule`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await RuleService.hardDelete(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Delete data Rule`,
      });
    } catch (error) {
      next(error);
    }
  }
}
