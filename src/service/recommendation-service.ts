import { prismaClient } from "../application/database";
import {
  TAddRecommendation,
  TParamRecommendation,
  TUpdateRecommendation,
} from "../model/recommendation-model";
import { RecommendationCategory, SourceType } from "../generated/prisma";
import { ResponseError } from "../error/response-error";

export class RecommendationService {
  static async create(request: TAddRecommendation): Promise<any> {
    const registerRequest = request as unknown as TAddRecommendation;

    return prismaClient.recommendation.create({
      data: { ...registerRequest },
    });
  }

  static async update(request: TUpdateRecommendation): Promise<any> {
    const updateRequest = request as unknown as TUpdateRecommendation;

    return prismaClient.recommendation.update({
      data: {
        ...updateRequest,
      },
      where: {
        id: updateRequest.id,
      },
    });
  }

  static async getList(request: TParamRecommendation): Promise<any> {
    const validRequest = request as unknown as TParamRecommendation;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const category = validRequest.filter.category;
    const sourceType = validRequest.filter.sourceType;

    const searchCondition = search
      ? {
          OR: [
            { title: { contains: search } },
            { sourceName: { contains: search } },
            { author: { contains: search } },
          ],
        }
      : {};

    const categoryCondition =
      category === "all"
        ? { category: { in: Object.values(RecommendationCategory) } }
        : { category: category as RecommendationCategory };

    const sourceTypeCondition =
      sourceType === "all"
        ? { sourceType: { in: Object.values(SourceType) } }
        : { sourceType: sourceType as SourceType };

    const data = await prismaClient.recommendation.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        AND: [searchCondition, categoryCondition, sourceTypeCondition],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prismaClient.recommendation.count({
      where: {
        AND: [searchCondition, categoryCondition, sourceTypeCondition],
      },
    });

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

  static async getRecommendationResult(id: string) {
    const userId = parseInt(id);
    const financialCondition = await prismaClient.financial.findFirst({
      where: {
        id: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    console.log(financialCondition);
    
  }
}
