import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TAddQuestion, TGetListQuestion } from "../types/api/question";
export class QuestionService {
  static async create(request: TAddQuestion): Promise<any> {
    const validRequest = request as unknown as TAddQuestion;

    const selectedFact: any = await prismaClient.fact.findUnique({
      where: {
        code: validRequest.factCode,
      },
    });

    return await prismaClient.question.create({
      data: {
        factId: selectedFact.id,
        text: validRequest.text,
      },
    });
  }

  static async getList(request: TGetListQuestion): Promise<any> {
    const validRequest = request as unknown as TGetListQuestion;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const searchCondition = search
      ? {
          text: { contains: search },
        }
      : {};

    const data = await prismaClient.question.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

    const total = await prismaClient.question.count({
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

    const selectCountRule = await prismaClient.question.count({
      where: {
        id: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `question is not found.`);
    }

    return await prismaClient.question.findUnique({
      where: {
        id: selectedId,
      },
    });
  }
}
