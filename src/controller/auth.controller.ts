import { Request, Response, NextFunction } from "express";
import { CreateUserRequest } from "../model/user-model";
import { AuthService } from "../service/auth.service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const authRegisterRequest: CreateUserRequest =
        req.body as CreateUserRequest;
      const response = await AuthService.register(authRegisterRequest);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
