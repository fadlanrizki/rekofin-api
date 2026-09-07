import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import {
  TAddRecommendation,
  TEditRecommendation,
} from "../types/api/recommendation";

const toApiRecommendation = ({ recommendationId, ...rest }: any) => ({
  id: recommendationId,
  ...rest,
});

export class RecommendationService {
  static async create(request: TAddRecommendation): Promise<any> {
    const validRequest = request as unknown as TAddRecommendation;

    if (!validRequest.conclusionId) {
      throw new ResponseError(400, `Data Conclusion is required`);
    }

    const recommendation = await prismaClient.recommendation.create({
      data: {
        conclusionId: validRequest.conclusionId,
        title: validRequest.title,
        content: validRequest.content,
        sourceId: validRequest.sourceId,
      },
    });

    return toApiRecommendation(recommendation);
  }

  static async update(request: TEditRecommendation): Promise<any> {
    const validRequest = request as unknown as TEditRecommendation;

    const selectedConclusion: any = await prismaClient.conclusion.findUnique({
      where: {
        conclusionId: validRequest.conclusionId,
      },
      select: {
        conclusionId: true,
      },
    });

    const recommendation = await prismaClient.recommendation.update({
      data: {
        conclusionId: selectedConclusion.conclusionId,
        title: validRequest.title,
        content: validRequest.content,
        sourceId: validRequest.sourceId,
      },
      where: {
        recommendationId: validRequest.id,
      },
    });

    return toApiRecommendation(recommendation);
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
            { source: { title: { contains: search } } },
          ],
        }
      : { isActive: true };

    const rawData = await prismaClient.recommendation.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
      include: {
        conclusion: {
          select: {
            category: true,
            description: true,
            code: true,
          },
        },
        source: {
          select: {
            title: true,
          },
        },
      },
    });

    const data = rawData.map(toApiRecommendation);

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
        recommendationId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data recommendation with ID : ${id} is not found.`,
      );
    }

    const recommendation: any = await prismaClient.recommendation.findUnique({
      where: {
        recommendationId: selectedId,
      },
      include: {
        conclusion: {
          select: { conclusionId: true, code: true, description: true },
        },
        source: {
          select: {
            sourceId: true,
          },
        },
      },
    });

    if (!recommendation) {
      return null;
    }

    const { conclusionId, ...conclusionRest } = recommendation.conclusion ?? {};
    const { sourceId, ...sourceRest } = recommendation.source ?? {};

    return {
      ...toApiRecommendation(recommendation),
      conclusion: recommendation.conclusion
        ? { id: conclusionId, ...conclusionRest }
        : recommendation.conclusion,
      source: recommendation.source
        ? { id: sourceId, ...sourceRest }
        : recommendation.source,
    };
  }
  static async softDelete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.recommendation.count({
      where: {
        recommendationId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data recommendation with ID : ${id} is not found.`,
      );
    }

    const recommendation = await prismaClient.recommendation.update({
      where: {
        recommendationId: selectedId,
      },
      data: { isActive: false },
    });

    return toApiRecommendation(recommendation);
  }
}
