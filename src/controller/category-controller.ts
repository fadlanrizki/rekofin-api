import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../service/category-service";
import {
  TAddCategoryRequest,
  TEditCategoryRequest,
  TGetListCategoryRequest,
} from "../types/api/category";

export class CategoryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TAddCategoryRequest;
      const response = await CategoryService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan Category",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TEditCategoryRequest;
      const response = await CategoryService.update(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Edit Category",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TGetListCategoryRequest;
      const response = await CategoryService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil Get List Category",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const response = await CategoryService.delete(id);
      res.status(200).json({
        ok: true,
        data: response.data,
        message: `Berhasil Delete Category`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await CategoryService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Get data Category`,
      });
    } catch (error) {
      next(error);
    }
  }
}
