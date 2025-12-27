import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  TAddCategoryRequest,
  TEditCategoryRequest,
  TGetListCategoryRequest,
} from "../types/api/category";
export class CategoryService {
  static async create(request: TAddCategoryRequest): Promise<any> {
    const validRequest = request as unknown as TAddCategoryRequest;

    return await prismaClient.category.create({
      data: {
        ...validRequest,
      },
    });
  }

  static async update(request: TEditCategoryRequest): Promise<any> {
    const validRequest = request as unknown as TEditCategoryRequest;

    return await prismaClient.category.update({
      data: {
        ...validRequest,
      },
      where: {
        id: validRequest.id,
      },
    });
  }

  static async getList(request: TGetListCategoryRequest): Promise<any> {
    const req = request as unknown as TGetListCategoryRequest;

    const page = parseInt(req.page);
    const limit = parseInt(req.limit);
    const search = req.search;

    const searchCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await prismaClient.$transaction([
      prismaClient.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: searchCondition,
      }),

      prismaClient.category.count({
        where: searchCondition,
      }),
    ]);

    return {
      data,
      total,
      page,
    };
  }

  static async delete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountCategory = await prismaClient.category.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountCategory === 0) {
      throw new ResponseError(
        400,
        `Data category with ID : ${id} is not found.`
      );
    }

    return await prismaClient.category.delete({
      where: {
        id: selectedId,
      },
    });
  }

  static async findById(id: string): Promise<any> {
    console.log("find by id");

    const selectedId = parseInt(id);

    const selectCountCategory = await prismaClient.category.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountCategory === 0) {
      throw new ResponseError(
        400,
        `Data category with ID : ${id} is not found.`
      );
    }

    return await prismaClient.category.findUnique({
      where: {
        id: selectedId,
      },
    });
  }
}
