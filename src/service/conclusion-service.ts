import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import { TAddConclusion, TEditConclusion } from "../types/api/conclusion";
export class ConclusionService {
  static async create(request: TAddConclusion): Promise<any> {
    const validRequest = request as unknown as TAddConclusion;

    return await prismaClient.conclusion.create({
      data: {
        code: validRequest.code,
        category: validRequest.category,
        description: validRequest.description,
      },
    });
  }

  static async update(request: TEditConclusion): Promise<any> {
    const validRequest = request as unknown as TEditConclusion;

    return await prismaClient.conclusion.update({
      data: {
        code: validRequest.code,
        category: validRequest.category,
        description: validRequest.description,
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
            { category: { contains: search } },
          ],
        }
      : { isActive: true };

    const data = await prismaClient.conclusion.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

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
        id: true,
        code: true,
        category: true,
      },
    });

    const formattedData = data.map((item) => ({
      id: item.id,
      label: `${item.code} - ${item.category}`,
    }));

    return formattedData;
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.conclusion.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data kesimpulan dengan ID : ${id} tidak ditemukan.`
      );
    }

    return await prismaClient.conclusion.findUnique({
      where: {
        id: selectedId,
      },
    });
  }

  static async softDelete(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.conclusion.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(
        400,
        `Data conclusion with ID : ${id} is not found.`
      );
    }

    return await prismaClient.conclusion.update({
      where: {
        id: selectedId,
      },
      data: {
        isActive: false,
      },
    });
  }
}
