import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user-service";
import { TCreateUser, TParamUser } from "../model/user-model";

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TCreateUser;
      const response = await UserService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan User",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TParamUser;

      const response = await UserService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil Get List User",
      });
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const response = await UserService.delete(id);
      res.status(200).json({
        ok: true,
        data: response.data,
        message: `Berhasil Delete user ${response.data.fullName}`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const response = await UserService.findUserByID(id);
      res.status(200).json({
        ok: true,
        data: response.data,
        message: `Berhasil Get data user`,
      });
    } catch (error) {
      next(error);
    }
  }
}
