import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import { TAddConclusion, TEditConclusion } from "../types/api/conclusion";

const toApiConclusion = ({ conclusionId, ...rest }: any) => ({
  id: conclusionId,
  ...rest,
});

export class ConclusionService {
  static async create(request: TAddConclusion): Promise<any> {
    const validRequest = request as unknown as TAddConclusion;

    const conclusion = await prismaClient.conclusion.create({
      data: {
        code: validRequest.code,
        category: validRequest.category,
        description: validRequest.description,
      },
    });

    return toApiConclusion(conclusion);
  }

  static async update(request: TEditConclusion): Promise<any> {
    const validRequest = request as unknown as TEditConclusion;

    const conclusion = await prismaClient.conclusion.update({
      data: {
        code: validRequest.code,
        category: validRequest.category,
        description: validRequest.description,
      },
      where: {
        conclusionId: validRequest.id,
      },
    });

    return toApiConclusion(conclusion);
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
            { category: { contains: search } },
          ],
        }
      : { isActive: true };

    const rawData = await prismaClient.conclusion.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

    const data = rawData.map(toApiConclusion);

    const total = await prismaClient.conclusion.count({
      where: searchCondition,
    });

    return {
      data,
      total,
      page,
    };
  }

  static async getOptions(): Promise<any> {
    const data = await prismaClient.conclusion.findMany({
      where: { isActive: true },
      select: {
        conclusionId: true,
        code: true,
        category: true,
      },
    });

    const formattedData = data.map((item) => ({
      id: item.conclusionId,
      label: `${item.code} - ${item.category}`,
    }));

    return formattedData;
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.conclusion.count({
      where: {
        conclusionId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data kesimpulan dengan ID : ${id} tidak ditemukan.`,
      );
    }

    return await prismaClient.conclusion
      .findUnique({
        where: {
          conclusionId: selectedId,
        },
      })
      .then((conclusion) => conclusion && toApiConclusion(conclusion));
  }

  static async softDelete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.conclusion.count({
      where: {
        conclusionId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data conclusion with ID : ${id} is not found.`,
      );
    }

    const conclusion = await prismaClient.conclusion.update({
      where: {
        conclusionId: selectedId,
      },
      data: {
        isActive: false,
      },
    });

    return toApiConclusion(conclusion);
  }
}
