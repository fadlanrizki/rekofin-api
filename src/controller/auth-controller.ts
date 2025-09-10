import { Request, Response, NextFunction } from "express";
import { TLoginUser, TRegisterUser } from "../model/user-model";
import { AuthService } from "../service/auth-service";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TLoginUser;
      const response = await AuthService.login(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Login",
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TRegisterUser;
      const response = await AuthService.register(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil mendaftar",
      });
    } catch (error) {
      next(error);
    }
  }
}
