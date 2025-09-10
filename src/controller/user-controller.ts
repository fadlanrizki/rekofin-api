import { TRegisterUser } from "../model/user-model";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user-service";

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TRegisterUser;
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
  
}
