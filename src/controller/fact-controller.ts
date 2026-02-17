import { Request, Response, NextFunction } from "express";
import { TAddFact, TEditFact } from "../types/api/fact";
import { FactService } from "../service/fact-service";
import { TGetList } from "../types/api/common";

export class FactController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TAddFact;
      const response = await FactService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan Fact",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TEditFact;
      const response = await FactService.update(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Edit Fact",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TGetList;

      const response = await FactService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil Get List Fact",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await FactService.getOptions();
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil mendapatkan opsi fakta",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await FactService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Get data Fact`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await FactService.softDelete(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Delete Fact`,
      });
    } catch (error) {
      next(error);
    }
  }
}
