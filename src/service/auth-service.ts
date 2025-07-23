import { prismaClient } from "../application/database";
import {
  CreateUserRequest,
  getRoleUser,
  LoginUserRequest,
  toUserModel,
  UserResponse,
} from "../model/user-model";
import { AuthValidation } from "../validation/auth-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { Prisma } from "../generated/prisma";

export class AuthService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      AuthValidation.REGISTER,
      request
    );

    const selectCountUser = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });

    if (selectCountUser != 0) {
      throw new ResponseError(400, "username already exist");
    }

    const response = await prismaClient.user.create({
      data: {
        ...(registerRequest as Prisma.UserCreateInput),
        role: getRoleUser(),
      },
    });

    return toUserModel(response);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(AuthValidation.LOGIN, request);

    const user = await prismaClient.user.findFirst({
      where: {
        OR: [{ username: request.username }, { email: request.username }],
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
      user.username !== request.username ||
      user.password !== request.password
    ) {
      throw new ResponseError(400, "Invalid Username Or Password");
    }

    const fullUser = await prismaClient.user.findUnique({
      where: { id: user.id },
      select: {
        username: true,
        fullName: true,
        role: true,
      },
    });

    if (!fullUser) {
      throw new ResponseError(400, "User not found");
    }

    const response: UserResponse = {
      username: fullUser.username,
      fullName: fullUser.fullName,
      role: fullUser.role,
    };

    return response;
  }
}
