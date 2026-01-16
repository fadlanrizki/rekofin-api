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
        message: "Berhasil Menambahkan data kesimpulan",
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
        message: "Berhasil memperbarui data kesimpulan",
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
        message: "Berhasil mendapatkan daftar kesimpulan",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ConclusionService.getOptions();
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Mendapatkan data opsi kesimpulan",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await ConclusionService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil mendapatkan data kesimpulan dengan id ${id}`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await ConclusionService.softDelete(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil hapus data kesimpulan`,
      });
    } catch (error) {
      next(error);
    }
  }
}
