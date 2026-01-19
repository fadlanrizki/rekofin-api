import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";

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
      where: searchCondition
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

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.user.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data user with ID : ${id} is not found.`
      );
    }

    return await prismaClient.user.findUnique({
      where: {
        id: selectedId,
      }
    });
  }
  
}
