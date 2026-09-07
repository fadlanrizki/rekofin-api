import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import { TAddFact, TEditFact } from "../types/api/fact";

const toApiFact = ({ factId, ...rest }: any) => ({ id: factId, ...rest });

export class FactService {
  static async create(request: TAddFact): Promise<any> {
    const validRequest = request as unknown as TAddFact;

    const fact = await prismaClient.fact.create({
      data: {
        code: validRequest.code,
        description: validRequest.description,
        question: validRequest.question,
        fact: validRequest.fact,
      },
    });

    return toApiFact(fact);
  }

  static async update(request: TEditFact): Promise<any> {
    const validRequest = request as unknown as TEditFact;

    const fact = await prismaClient.fact.update({
      data: {
        code: validRequest.code,
        description: validRequest.description,
        question: validRequest.question,
        fact: validRequest.fact,
      },
      where: {
        factId: validRequest.id,
      },
    });

    return toApiFact(fact);
  }

  static async getList(request: TGetList): Promise<any> {
    const validRequest = request as unknown as TGetList;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const searchCondition = search
      ? {
          OR: [
            { code: { contains: search } },
            { description: { contains: search } },
            { question: { contains: search } },
            { fact: { contains: search } },
          ],
          isActive: true,
        }
      : { isActive: true };

    const rawData = await prismaClient.fact.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

    const data = rawData.map(toApiFact);

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
        factId: true,
        code: true,
        fact: true,
      },
    });

    const formattedData = data.map((item) => ({
      id: item.factId,
      label: `${item.code} - ${item.fact}`,
    }));

    return formattedData;
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.fact.count({
      where: {
        factId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data fact with ID : ${id} is not found.`);
    }

    return await prismaClient.fact
      .findUnique({
        where: {
          factId: selectedId,
        },
      })
      .then((fact) => fact && toApiFact(fact));
  }

  static async softDelete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.fact.count({
      where: {
        factId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data fact with ID : ${id} is not found.`);
    }

    const fact = await prismaClient.fact.update({
      data: {
        isActive: false,
      },
      where: {
        factId: selectedId,
      },
    });

    return toApiFact(fact);
  }
}
