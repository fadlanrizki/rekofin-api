import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { TGetList } from "../types/api/common";
import { TAddRule, TEditRule } from "../types/api/rule";

export class RuleService {
  static async create(request: TAddRule, createdBy: number): Promise<any> {
    const validRequest = request as unknown as TAddRule;

    const facts = await prismaClient.fact.findMany({
      where: {
        factId: {
          in: validRequest.conditions,
        },
      },
    });

    const conclusions = await prismaClient.conclusion.findMany({
      where: {
        conclusionId: {
          in: validRequest.conclusions,
        },
      },
    });

    if (facts.length !== validRequest.conditions.length) {
      throw new ResponseError(400, `One or more facts is not found.`);
    }

    if (conclusions.length !== validRequest.conclusions.length) {
      throw new ResponseError(400, `One or more conclusions is not found.`);
    }

    const result = await prismaClient.$transaction(async (tx) => {
      // insert rule
      const rule = await tx.rule.create({
        data: {
          name: validRequest.name,
          description: validRequest.description,
          priority: validRequest.priority ?? 0,
          isActive: true,
          createdBy: createdBy,
        },
      });

      // insert rule condition
      const ruleConditions = validRequest.conditions.map((id) => {
        return {
          ruleId: rule.ruleId,
          factId: id,
        };
      });

      await tx.ruleCondition.createMany({
        data: ruleConditions,
      });

      // insert rule result
      const ruleResults = validRequest.conclusions.map((id) => {
        return {
          ruleId: rule.ruleId,
          conclusionId: id,
        };
      });

      await tx.ruleResult.createMany({
        data: ruleResults,
      });

      return rule;
    });

    return result;
  }

  static async update(request: TEditRule): Promise<any> {
    const validRequest = request as unknown as TEditRule;

    const facts = await prismaClient.fact.findMany({
      where: {
        factId: {
          in: validRequest.conditions,
        },
      },
    });

    const conclusions = await prismaClient.conclusion.findMany({
      where: {
        conclusionId: {
          in: validRequest.conclusions,
        },
      },
    });

    if (facts.length !== validRequest.conditions.length) {
      throw new ResponseError(400, `One or more facts is not found.`);
    }

    if (conclusions.length !== validRequest.conclusions.length) {
      throw new ResponseError(400, `One or more conclusions is not found.`);
    }

    const result = await prismaClient.$transaction(async (tx) => {
      // insert rule
      const rule = await tx.rule.update({
        data: {
          name: validRequest.name,
          description: validRequest.description,
          priority: validRequest.priority ?? 0,
        },
        where: {
          ruleId: validRequest.id,
        },
      });

      // delete old rule condition by id
      await prismaClient.ruleCondition.deleteMany({
        where: {
          ruleId: validRequest.id,
        },
      });

      // delete old rule condition by id
      await prismaClient.ruleResult.deleteMany({
        where: {
          ruleId: validRequest.id,
        },
      });

      // insert rule condition
      const ruleConditions = validRequest.conditions.map((id) => {
        return {
          ruleId: rule.ruleId,
          factId: id,
        };
      });

      await tx.ruleCondition.createMany({
        data: ruleConditions,
      });

      // insert rule result
      const ruleResults = validRequest.conclusions.map((id) => {
        return {
          ruleId: rule.ruleId,
          conclusionId: id,
        };
      });

      await tx.ruleResult.createMany({
        data: ruleResults,
      });

      return rule;
    });

    return result;
  }

  static async getList(request: TGetList): Promise<any> {
    const validRequest = request as unknown as TGetList;

    const page = parseInt(validRequest.page);
    const limit = parseInt(validRequest.limit);
    const search = validRequest.search;

    const searchCondition = search ? { name: { contains: search } } : {};

    const rules = await prismaClient.rule.findMany({
      orderBy: { ruleId: "desc" },
      include: {
        ruleConditions: {
          include: {
            fact: {
              select: {
                factId: true,
                code: true,
                description: true,
              },
            },
          },
        },
        ruleResults: {
          include: {
            conclusion: {
              select: {
                conclusionId: true,
                code: true,
                category: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      where: searchCondition,
    });

    const data = rules.map((rule) => ({
      id: rule.ruleId,
      name: rule.name,
      description: rule.description,
      priority: rule.priority,
      isActive: rule.isActive,
      createdAt: rule.createdAt,
      conditions: rule.ruleConditions.map((rc) => {
        const { factId, ...rest } = rc.fact;
        return { id: factId, ...rest };
      }),
      conclusions: rule.ruleResults.map((rr) => {
        const { conclusionId, ...rest } = rr.conclusion;
        return { id: conclusionId, ...rest };
      }),
    }));

    const total = await prismaClient.rule.count({
      where: searchCondition,
    });

    return {
      data,
      total,
      page,
    };
  }

  static async hardDelete(id: string): Promise<any> {
    const ruleId = parseInt(id);

    const selectCountRule = await prismaClient.rule.count({
      where: {
        ruleId: ruleId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data rule with ID : ${id} is not found.`);
    }

    const result = await prismaClient.$transaction(async (tx) => {
      await tx.ruleCondition.deleteMany({
        where: {
          ruleId: ruleId,
        },
      });

      await tx.ruleResult.deleteMany({
        where: {
          ruleId: ruleId,
        },
      });

      await tx.rule.deleteMany({
        where: {
          ruleId: ruleId,
        },
      });
    });

    return result;
  }

  static async softDelete(id: string): Promise<any> {
    const ruleId = parseInt(id);

    const selectCountRule = await prismaClient.rule.count({
      where: {
        ruleId: ruleId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data rule with ID : ${id} is not found.`);
    }

    return await prismaClient.rule.update({
      data: {
        isActive: false,
      },
      where: {
        ruleId: ruleId,
      },
    });
  }

  static async findById(id: string): Promise<any> {
    const selectedId = parseInt(id);

    const selectCountRule = await prismaClient.rule.count({
      where: {
        ruleId: selectedId,
      },
    });

    if (selectCountRule === 0) {
      throw new ResponseError(400, `Data rule with ID : ${id} is not found.`);
    }

    const selectedRule: any = await prismaClient.rule.findFirst({
      where: {
        ruleId: selectedId,
      },
      include: {
        ruleConditions: {
          include: {
            fact: {
              select: {
                factId: true,
                code: true,
                fact: true,
              },
            },
          },
        },
        ruleResults: {
          include: {
            conclusion: {
              select: {
                conclusionId: true,
                code: true,
                category: true,
              },
            },
          },
        },
      },
    });

    const data = {
      id: selectedRule.ruleId,
      name: selectedRule.name,
      description: selectedRule.description,
      priority: selectedRule.priority,
      isActive: selectedRule.isActive,
      createdAt: selectedRule.createdAt,
      conditions: selectedRule.ruleConditions.map((rc: any) => {
        const { factId, ...rest } = rc.fact;
        return { id: factId, ...rest };
      }),
      conclusions: selectedRule.ruleResults.map((rr: any) => {
        const { conclusionId, ...rest } = rr.conclusion;
        return { id: conclusionId, ...rest };
      }),
    };

    return data;
  }
}
