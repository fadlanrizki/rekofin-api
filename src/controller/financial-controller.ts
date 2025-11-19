import { Request, Response, NextFunction } from "express";
import { FinancialService } from "../service/financial-service";
import { TAddFinancial } from "../model/financial-model";

export class FinancialController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TAddFinancial;
      const response = await FinancialService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan Data Keuangan",
      });
    } catch (error) {
      next(error);
    }
  }
}
