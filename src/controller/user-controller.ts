import { AddUserRequest, UpdateUserRequest } from "../model/user-model";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user-service";

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const addUserRequest: AddUserRequest = req.body as AddUserRequest;
      const response = await UserService.create(addUserRequest);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan User",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.getUsers();
      res.status(200).json({
        data: response,
        message: "Berhasil Mendapatkan data User",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateUserRequest: UpdateUserRequest =
        req.body as UpdateUserRequest;
      const response = await UserService.update(updateUserRequest);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Update Data User",
      });
    } catch (error) {
      next(error);
    }
  }
}
