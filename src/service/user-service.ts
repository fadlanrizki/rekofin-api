import { prismaClient } from "../application/database";
import {
  AddUserRequest,
  AddUserResponse,
  getUsersResponse,
  toUserModel,
  UpdateUserRequest,
  UpdateUserResponse,
} from "../model/user-model";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { Prisma } from "../generated/prisma";
import { UserValidation } from "../validation/user-validation";

export class UserService {
  static async create(request: AddUserRequest): Promise<AddUserResponse> {
    const createUserRequest = Validation.validate(
      UserValidation.CREATE,
      request
    );

    const selectCountUser = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });

    const selectCountUserEmail = await prismaClient.user.count({
      where: {
        email: request.email,
      },
    });

    if (selectCountUser != 0) {
      throw new ResponseError(400, "Username already exist");
    }

    if (selectCountUserEmail != 0) {
      throw new ResponseError(400, "Email already exist");
    }

    const response = await prismaClient.user.create({
      data: {
        ...(createUserRequest as Prisma.UserCreateInput),
      },
    });

    return toUserModel(response);
  }

  static async getUsers(): Promise<getUsersResponse> {
    const response = await prismaClient.user.findMany();

    return {
      list: response,
    };
  }

  static async update(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const updateUserRequest = Validation.validate(
      UserValidation.UPDATE,
      request
    );

    
    const response = await prismaClient.user.update({
      where: {
        id: request.id
      },
      data: {
        ...(updateUserRequest as Prisma.UserCreateInput),
      },
    });

    return {
      id: response.id,
      fullName: response.fullName
    }

    
  }
}
