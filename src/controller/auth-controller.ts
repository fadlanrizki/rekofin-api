import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth-service";
import { TLoginRequest, TRegisterUserRequest } from "../types/api/auth";

export class AuthController {
  static async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TLoginRequest;
      const response = await AuthService.userLogin(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Login",
      });
    } catch (error) {
      next(error);
    }
  }

  static async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TLoginRequest;
      const response = await AuthService.adminLogin(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Login",
      });
    } catch (error) {
      next(error);
    }
  }

  static async userRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TRegisterUserRequest;
      const response = await AuthService.registerUser(request);
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
