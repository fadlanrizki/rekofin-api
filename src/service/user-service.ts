import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import { TCreateUser } from "../types/api/user";
import bcrypt from "bcryptjs";

export class UserService {
  static async getList(request: TGetList): Promise<any> {
    const validRequest = request as unknown as TGetList;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const searchCondition = search
      ? {
          isActive: true,
          OR: [
            { fullname: { contains: search } },
            { username: { contains: search } },
          ],
        }
      : { isActive: true };

    const data = await prismaClient.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

    const total = await prismaClient.user.count({
      where: searchCondition,
    });

    return {
      data,
      total,
      page,
    };
  }

  static async create(request: TCreateUser): Promise<any> {
    const validRequest = request as unknown as TCreateUser;

    const selectCountUser = await prismaClient.user.count({
      where: {
        OR: [
          { username: validRequest.username },
          { email: validRequest.email },
        ],
      },
    });

    if (selectCountUser > 0) {
      throw new ResponseError(
        400,
        `Data user with username : ${validRequest.username} or email : ${validRequest.email} is already exists.`,
      );
    }

    const hashedPassword = await bcrypt.hash(validRequest.password, 10);

    return await prismaClient.user.create({
      data: {
        fullname: validRequest.fullname,
        username: validRequest.username,
        email: validRequest.email,
        password: hashedPassword,
        role: validRequest.role,
        gender: validRequest.gender || null,
      },
    });
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.user.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data user with ID : ${id} is not found.`);
    }

    return await prismaClient.user.findUnique({
      where: {
        id: selectedId,
      },
    });
  }

  static async softDelete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountUser = await prismaClient.user.findUnique({
      where: {
        id: selectedId,
      },
    });

    if (!selectCountUser) {
      throw new ResponseError(400, `Data user with ID : ${id} is not found.`);
    }

    return await prismaClient.user.update({
      where: {
        id: selectedId,
      },
      data: {
        isActive: false,
      },
    });
  }
}
