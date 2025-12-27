import { prismaClient } from "../application/database";
import { AuthValidation } from "../validation/auth-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { USER_SECRET_KEY, ADMIN_SECRET_KEY } from "../utils/env";
import jwt from "jsonwebtoken";
import { TLoginRequest, TRegisterUserRequest } from "../types/api/auth";
import bcrypt from "bcryptjs";

export class AuthService {
  static async userLogin(request: TLoginRequest): Promise<any> {
    const loginRequest = Validation.validate(
      AuthValidation.LOGIN,
      request
    ) as unknown as TLoginRequest;

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
        email: true,
      },
    });

    if (!selectedUser) {
      throw new ResponseError(400, "User not found");
    }

    const jwtPayload = {
      ...selectedUser,
      type: "USER",
    };

    const token = jwt.sign(jwtPayload, USER_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "3h",
    });

    const response = {
      token,
    };

    return response;
  }

  static async adminLogin(request: TLoginRequest): Promise<any> {
    const loginRequest = Validation.validate(
      AuthValidation.LOGIN,
      request
    ) as unknown as TLoginRequest;

    const user = await prismaClient.admin.findFirst({
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

    const selectedUser = await prismaClient.admin.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!selectedUser) {
      throw new ResponseError(400, "admin not found");
    }

    const jwtPayload = {
      ...selectedUser,
      type: "ADMIN",
    };

    const token = jwt.sign(jwtPayload, ADMIN_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "3h",
    });

    const response = {
      token,
    };

    return response;
  }

  static async registerUser(request: TRegisterUserRequest): Promise<any> {
    const registerRequest = Validation.validate(
      AuthValidation.REGISTER,
      request
    ) as unknown as TRegisterUserRequest;

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

    const hashedPassword = await bcrypt.hash(registerRequest.password, 10);
    registerRequest.password = hashedPassword;

    return await prismaClient.user.create({
      data: {
        ...registerRequest,
      },
      select: {
        fullname: true,
      },
    });
  }
}
