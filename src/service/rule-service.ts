import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TAddRule, TGetListRule } from "../types/api/rule";

export class RuleService {
  static async create(request: TAddRule): Promise<any> {
    const validRequest = request as unknown as TAddRule;
  }

  static async getList(request: TGetListRule): Promise<any> {
    const validRequest = request as unknown as TGetListRule;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const searchCondition = search ? { name: { contains: search } } : {};

    const data = await prismaClient.rule.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

    const total = await prismaClient.rule.count({
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
