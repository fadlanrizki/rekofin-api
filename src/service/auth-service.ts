import { prismaClient } from "../application/database";
import { getRoleUser, TLoginUser, TRegisterUser } from "../model/user-model";
import { AuthValidation } from "../validation/auth-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { SECRET_KEY } from "../utils/env";
import jwt from "jsonwebtoken";

export class AuthService {
  static async login(request: TLoginUser): Promise<any> {
    const loginRequest = Validation.validate(
      AuthValidation.LOGIN,
      request
    ) as unknown as TLoginUser;

    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          { username: loginRequest.credential },
          { email: loginRequest.credential },
        ],
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      throw new ResponseError(400, "Invalid Username Or Password");
    }

    if (
      user.username !== loginRequest.credential ||
      user.password !== loginRequest.password
    ) {
      throw new ResponseError(400, "Invalid Username Or Password");
    }

    const selectedUser = await prismaClient.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!selectedUser) {
      throw new ResponseError(400, "User not found");
    }

    const token = jwt.sign(selectedUser, SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "3h",
    });

    const response = {
      token,
    };

    return response;
  }

  static async register(request: TRegisterUser): Promise<any> {
    const registerRequest = Validation.validate(
      AuthValidation.REGISTER,
      request
    ) as unknown as TRegisterUser;

    const selectCountUser = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    const selectCountUserEmail = await prismaClient.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (selectCountUser != 0) {
      throw new ResponseError(400, "Username already exist");
    }

    if (selectCountUserEmail != 0) {
      throw new ResponseError(400, "Email already exist");
    }

    return await prismaClient.user.create({
      data: {
        ...registerRequest,
        role: getRoleUser(),
      },
      select: {
        fullName: true,
        username: true,
      },
    });
  }
}
