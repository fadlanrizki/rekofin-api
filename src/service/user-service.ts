import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import {
  TChangePassword,
  TCreateUser,
  TUpdateProfile,
} from "../types/api/user";
import bcrypt from "bcryptjs";

const toApiUser = ({ userId, ...rest }: any) => ({ id: userId, ...rest });

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
      : {};

    const rawData = await prismaClient.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
      select: {
        userId: true,
        fullname: true,
        username: true,
        email: true,
        role: true,
        gender: true,
        isActive: true,
        createdAt: true,
      },
    });

    const data = rawData.map(toApiUser);

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

    const user = await prismaClient.user.create({
      data: {
        fullname: validRequest.fullname,
        username: validRequest.username,
        email: validRequest.email,
        password: hashedPassword,
        role: validRequest.role,
        gender: validRequest.gender || null,
      },
    });

    return toApiUser(user);
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.user.count({
      where: {
        userId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data user with ID : ${id} is not found.`);
    }

    const user = await prismaClient.user.findUnique({
      where: {
        userId: selectedId,
      },
    });

    return user && toApiUser(user);
  }

  static async changeStatus(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountUser = await prismaClient.user.findUnique({
      where: {
        userId: selectedId,
      },
    });

    if (!selectCountUser) {
      throw new ResponseError(400, `Data user with ID : ${id} is not found.`);
    }

    const user = await prismaClient.user.update({
      where: {
        userId: selectedId,
      },
      data: {
        isActive: !selectCountUser.isActive,
      },
      select: {
        userId: true,
        fullname: true,
        isActive: true,
      },
    });

    return toApiUser(user);
  }

  static async getProfile(req: any): Promise<any> {
    const id = req.user.id;
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.user.count({
      where: {
        userId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data user with ID : ${id} is not found.`);
    }

    const user = await prismaClient.user.findUnique({
      where: {
        userId: selectedId,
      },
      select: {
        userId: true,
        fullname: true,
        username: true,
        email: true,
        role: true,
        gender: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user && toApiUser(user);
  }

  static async updateProfile(req: any): Promise<any> {
    const id = req.user.id;
    const selectedId = parseInt(id);
    const request = req.body as unknown as TUpdateProfile;

    const selectCountUser = await prismaClient.user.findUnique({
      where: {
        userId: selectedId,
      },
    });

    if (!selectCountUser) {
      throw new ResponseError(400, `Data user with ID : ${id} is not found.`);
    }

    if (request.username || request.email) {
      const selectCountUser = await prismaClient.user.count({
        where: {
          userId: { not: selectedId },
          OR: [{ username: request.username }, { email: request.email }],
        },
      });

      if (selectCountUser > 0) {
        throw new ResponseError(
          400,
          `Data user with username : ${request.username} or email : ${request.email} is already exists.`,
        );
      }

      const user = await prismaClient.user.update({
        where: {
          userId: selectedId,
        },
        data: {
          fullname: request.fullname,
          username: request.username,
          email: request.email,
          gender: request.gender || null,
        },
      });

      return toApiUser(user);
    }
  }

  static async changePassword(req: any): Promise<any> {
    const id = req.user.id;
    const selectedId = parseInt(id);
    const request = req.body as unknown as TChangePassword;

    const user = await prismaClient.user.findUnique({
      where: { userId: selectedId },
    });

    if (!user) {
      throw new ResponseError(400, `Data user with ID : ${id} is not found.`);
    }

    const isMatch = await bcrypt.compare(request.old_password, user.password);
    if (!isMatch) {
      throw new ResponseError(400, `Old password is incorrect.`);
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    await prismaClient.user.update({
      where: { userId: selectedId },
      data: { password: hashedPassword },
    });
  }
}
