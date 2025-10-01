import { Request, Response, NextFunction } from "express";
import { RuleService } from "../service/rule-service";
import { TAddRule, TParamRule } from "../model/rule-model";

export class RuleController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TAddRule;
      const response = await RuleService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan Rule",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TParamRule;

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

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const response = await RuleService.delete(id);
      res.status(200).json({
        ok: true,
        data: response.data,
        message: `Berhasil Delete Rule`,
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
}
