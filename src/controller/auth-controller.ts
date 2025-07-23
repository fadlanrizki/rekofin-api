import { Request, Response, NextFunction } from "express";
import { CreateUserRequest, LoginUserRequest } from "../model/user-model";
import { AuthService } from "../service/auth-service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const registerRequest: CreateUserRequest =
        req.body as CreateUserRequest;
      const response = await AuthService.register(registerRequest);
      res.status(200).json({
        data: response,
        message: "Berhasil mendaftar"
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginRequest: LoginUserRequest =
        req.body as LoginUserRequest;
      const response = await AuthService.login(loginRequest);
      res.status(200).json({
        data: response,
        message: "Berhasil Login"
      });
    } catch (error) {
      next(error);
    }
  }
}
 