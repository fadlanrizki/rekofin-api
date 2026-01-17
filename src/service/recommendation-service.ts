import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import {
  TAddRecommendation,
  TEditRecommendation,
} from "../types/api/recommendation";
export class RecommendationService {
  static async create(request: TAddRecommendation): Promise<any> {
    const validRequest = request as unknown as TAddRecommendation;

    if (!validRequest.conclusionId) {
      throw new ResponseError(400, `Data Conclusion is required`);
    }

    return await prismaClient.recommendation.create({
      data: {
        conclusionId: validRequest.conclusionId,
        title: validRequest.title,
        content: validRequest.content,
        source: validRequest.source,
      },
    });
  }

  static async update(request: TEditRecommendation): Promise<any> {
    const validRequest = request as unknown as TEditRecommendation;

    const selectedConclusion: any = await prismaClient.conclusion.findUnique({
      where: {
        id: validRequest.conclusionId,
      },
      select: {
        id: true,
      },
    });

    return await prismaClient.recommendation.update({
      data: {
        conclusionId: selectedConclusion.id,
        title: validRequest.title,
        content: validRequest.content,
        source: validRequest.source,
      },
      where: {
        id: validRequest.id,
      },
    });
  }

  static async getList(request: TGetList): Promise<any> {
    const validRequest = request as unknown as TGetList;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const searchCondition = search
      ? {
          isActive: true,
          OR: [
            { title: { contains: search } },
            { source: { contains: search } },
          ],
        }
      : { isActive: true };

    const data = await prismaClient.recommendation.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
      include: {
        conclusion: {
          select: {
            category: true
          }
        },
      },
    });

    const total = await prismaClient.recommendation.count({
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

    const selectCountRule = await prismaClient.recommendation.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data recommendation with ID : ${id} is not found.`
      );
    }

    return await prismaClient.recommendation.findUnique({
      where: {
        id: selectedId,
      },
      include: {
        conclusion: {
          select: { id: true },
        },
      },
    });
  }
  static async softDelete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.recommendation.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data recommendation with ID : ${id} is not found.`
      );
    }

    return await prismaClient.recommendation.update({
      where: {
        id: selectedId,
      },
      data: { isActive: false },
    });
  }
}
