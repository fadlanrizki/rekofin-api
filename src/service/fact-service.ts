import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import { TAddFact, TEditFact } from "../types/api/fact";
export class FactService {
  static async create(request: TAddFact): Promise<any> {
    const validRequest = request as unknown as TAddFact;

    return await prismaClient.fact.create({
      data: {
        code: validRequest.code,
        description: validRequest.description,
        question: validRequest.question,
      },
    });
  }

  static async update(request: TEditFact): Promise<any> {
    const validRequest = request as unknown as TEditFact;

    return await prismaClient.fact.update({
      data: {
        code: validRequest.code,
        description: validRequest.description,
        question: validRequest.question,
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
            { code: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : { isActive: true };

    const data = await prismaClient.fact.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

    const total = await prismaClient.fact.count({
      where: searchCondition,
    });

    return {
      data,
      total,
      page,
    };
  }

  static async getOptions(): Promise<any> {
    const data = await prismaClient.fact.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        description: true,
      },
    });

    const formattedData = data.map((item) => ({
      id: item.id,
      label: `${item.code} - ${item.description}`,
    }));

    return formattedData;
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.fact.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data fact with ID : ${id} is not found.`);
    }

    return await prismaClient.fact.findUnique({
      where: {
        id: selectedId,
      },
    });
  }

  static async softDelete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.fact.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data fact with ID : ${id} is not found.`);
    }

    return await prismaClient.fact.update({
      data: {
        isActive: false,
      },
      where: {
        id: selectedId,
      },
    });
  }
}
