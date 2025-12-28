import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  TAddRecommendation,
  TEditRecommendation,
  TGetListRecommendation,
} from "../types/api/recommendation";

export class RecommendationService {
  static async create(request: TAddRecommendation): Promise<any> {
    const registerRequest = request as unknown as TAddRecommendation;

    return prismaClient.recommendation.create({
      data: { ...registerRequest },
    });
  }

  static async update(request: TEditRecommendation): Promise<any> {
    const updateRequest = request as unknown as TEditRecommendation;

    return prismaClient.recommendation.update({
      data: {
        ...updateRequest,
      },
      where: {
        id: updateRequest.id,
      },
    });
  }

  static async getList(request: TGetListRecommendation): Promise<any> {
    const validRequest = request as unknown as TGetListRecommendation;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const searchCondition = search
      ? {
          OR: [{ message: { contains: search } }],
        }
      : {};

    const [data, total] = await prismaClient.$transaction([
      prismaClient.recommendation.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: searchCondition,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prismaClient.recommendation.count({
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
    await prismaClient.recommendation.delete({
      where: {
        id: selectedId,
      },
    });
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCount = await prismaClient.recommendation.count({
      where: {
        id: selectedId,
      },
    });

    if (!selectCount) {
      throw new ResponseError(400, "Cannot Get Data, ID not found");
    }

    return await prismaClient.recommendation.findUnique({
      where: {
        id: selectedId,
      },
    });
  }
}
