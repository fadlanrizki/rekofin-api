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

    if (!validRequest.conclusionCode) {
      throw new ResponseError(400, `Data Conclusion is required`);
    }

    const selectedConclusion: any = await prismaClient.conclusion.findUnique({
      where: {
        code: validRequest.conclusionCode,
      },
      select: {
        id: true,
      },
    });

    return await prismaClient.recommendation.create({
      data: {
        conclusionId: selectedConclusion.id,
        text: validRequest.text,
        source: validRequest.source,
        principle: validRequest.principle,
      },
    });
  }

  static async update(request: TEditRecommendation): Promise<any> {
    const validRequest = request as unknown as TEditRecommendation;

    const selectedConclusion: any = await prismaClient.conclusion.findUnique({
      where: {
        code: validRequest.conclusionCode,
      },
      select: {
        id: true,
      },
    });

    return await prismaClient.recommendation.update({
      data: {
        conclusionId: selectedConclusion.id,
        text: validRequest.text,
        source: validRequest.source,
        principle: validRequest.principle,
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
          OR: [
            { text: { contains: search } },
            { source: { contains: search } },
          ],
        }
      : {};

    const data = await prismaClient.recommendation.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
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
    });
  }
}
