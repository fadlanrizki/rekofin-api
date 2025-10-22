import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { RecommendationCategory } from "../generated/prisma";
import { TAddRule, TEditRule, TParamRule } from "../model/rule-model";
export class RuleService {
  static async create(request: TAddRule): Promise<any> {
    const validRequest = request as unknown as TAddRule;

    return await prismaClient.rule.create({
      data: {
        name: validRequest.name,
        conditions: validRequest.conditions,
        active: validRequest.active,
        description: validRequest.description,
        categoryResult: validRequest.categoryResult as RecommendationCategory,
      },
    });
  }

  static async update(request: TEditRule): Promise<any> {
    const validRequest = request as unknown as TEditRule;

    return await prismaClient.rule.update({
      data: {
        name: validRequest.name,
        conditions: validRequest.conditions,
        active: validRequest.active,
        description: validRequest.description,
        categoryResult: validRequest.categoryResult as RecommendationCategory,
      },
      where: {
        id: validRequest.id,
      },
    });
  }

  static async getList(request: TParamRule): Promise<any> {
    const validRequest = request as unknown as TParamRule;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const categoryResult = validRequest.filter.categoryResult;
    const search = validRequest.search;

    const searchCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const categoryResultCondition =
      categoryResult === "all"
        ? { categoryResult: { in: Object.values(RecommendationCategory) } }
        : { categoryResult: categoryResult as RecommendationCategory };

    const data = await prismaClient.rule.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        AND: [searchCondition, categoryResultCondition],
      },
    });

    const total = await prismaClient.rule.count({
      where: {
        AND: [searchCondition, categoryResultCondition],
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

    return await prismaClient.rule.delete({
      where: {
        id: selectedId,
      },
    });
  }
  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.rule.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data rule with ID : ${id} is not found.`);
    }

    return await prismaClient.rule.findUnique({
      where: {
        id: selectedId,
      },
    });
  }
}
