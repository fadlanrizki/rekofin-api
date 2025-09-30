import { UserValidation } from "../validation/user-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  getRoleUser,
  TCreateUser,
  TParamUser,
  TRegisterUser,
  TUpdateUser,
} from "../model/user-model";
import { Validation } from "../validation/validation";
import { Role } from "../generated/prisma";
import { Prisma } from "@prisma/client";

export class UserService {
  static async create(request: TCreateUser): Promise<any> {
    const registerRequest = Validation.validate(
      UserValidation.CREATE,
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

  static async getList(request: TParamUser): Promise<any> {
    const validRequest = Validation.validate(
      UserValidation.LIST,
      request
    ) as unknown as TParamUser;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const role = validRequest.filter.role;
    const search = validRequest.search;

    const roleCondition =
      role === "all"
        ? { role: { in: Object.values(Role) } }
        : { role: role as Role };

    const searchCondition = search
      ? {
          OR: [
            { fullName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const data = await prismaClient.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        AND: [searchCondition, roleCondition],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const total = await prismaClient.user.count();

    return {
      data,
      total,
      page,
    };
  }

  static delete = async (id: string): Promise<any> => {
    const selectedId = parseInt(id);

    return await prismaClient.user.delete({
      where: {
        id: selectedId,
      },
      select: {
        fullName: true,
      },
    });
  };

  static findUserByID = async (id: string): Promise<any> => {
    const selectedId = parseInt(id);

    return await prismaClient.user.findUnique({
      where: {
        id: selectedId,
      },
      select: {
        fullName: true,
        username: true,
        email: true,
        role: true,
        gender: true,
      },
    });
  };

  // static async update(request: TUpdateUser): Promise<any> {
  //   const updateRequest = Validation.validate(
  //     UserValidation.UPDATE,
  //     request
  //   ) as unknown as TUpdateUser;

  //   const selectCountUser = await prismaClient.user.count({
  //     where: {
  //       username: updateRequest.username,
  //     },
  //   });

  //   const selectCountUserEmail = await prismaClient.user.count({
  //     where: {
  //       email: updateRequest.email,
  //     },
  //   });

  //   if (selectCountUser != 0) {
  //     throw new ResponseError(400, "Username already exist");
  //   }

  //   if (selectCountUserEmail != 0) {
  //     throw new ResponseError(400, "Email already exist");
  //   }

  //   return await prismaClient.user.update({
  //     data: {
  //       ...updateRequest,
  //     },
  //     select: {
  //       fullName: true,
  //       username: true,
  //     },
  //   });
  // }
}
