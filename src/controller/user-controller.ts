import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { TGetList } from "../types/api/common";
import { TCreateUser } from "../types/api/user";

export class UserController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TGetList;

      const response = await UserService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil mengambil data user",
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await UserService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil mengambil data detail user`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.body as unknown as TCreateUser;
      const data = await UserService.create(request);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil menambahkan data user`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await UserService.changeStatus(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil mengubah status data user`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getProfile(req);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil mengambil data detail user`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.updateProfile(req);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil memperbarui data user`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.changePassword(req);
      res.status(200).json({
        ok: true,
        message: `Berhasil mengubah password`,
      });
    } catch (error) {
      next(error);
    }
  }
}
