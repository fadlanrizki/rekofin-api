import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import { TEditSource } from "../types/api/source";
import { SourceValidation } from "../validation/source-validation";
import { Validation } from "../validation/validation";

export class SourceService {
  static async create(req: any) {
    const request = Validation.validate(SourceValidation.CREATE, req.body);

    const source = await prismaClient.source.create({
      data: request as any,
    });

    return source;
  }

  static async update(req: TEditSource) {
    const request = req as unknown as TEditSource;

    const checkSource = await prismaClient.source.findUnique({
      where: {
        id: request.id,
      },
    });

    if (!checkSource) {
      throw new ResponseError(404, "Source not found");
    }

    const source = await prismaClient.source.update({
      where: {
        id: request.id,
      },
      data: request as any,
    });

    return source;
  }

  static async delete(req: any) {
    const id = Number(req.params.id);

    const checkSource = await prismaClient.source.findUnique({
      where: {
        id: id,
      },
    });

    if (!checkSource) {
      throw new ResponseError(404, "Source not found");
    }

    await prismaClient.source.delete({
      where: {
        id: id,
      },
    });

    return { message: "Source deleted successfully" };
  }

  static async get(req: any) {
    const id = Number(req.params.id);

    const source = await prismaClient.source.findUnique({
      where: {
        id: id,
      },
    });

    if (!source) {
      throw new ResponseError(404, "Source not found");
    }

    return source;
  }

  static async list(req: any) {
    const { page, limit, search } = req.query as TGetList;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } }, // Remove mode: 'insensitive' for MySQL default, but if user configured it differently it might be needed. Usually Prisma handles it but MySQL is case insensitive by default for some collations. I will assume default behavior which often doesn't need mode: insensitive or it is ignored/supported depending on DB.
        { author: { contains: search } },
        { publisher: { contains: search } },
      ];
    }

    const data = await prismaClient.source.findMany({
      where: where,
      skip: skip,
      take: take,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prismaClient.source.count({
      where: where,
    });

    return {
      data,
      total,
      page: Number(page)
    };
  }
}
