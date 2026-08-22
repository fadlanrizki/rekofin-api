import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { ConsultationStatus } from "../generated/prisma";
import { TGetList } from "../types/api/common";
export class ConsultationService {
  static selectBestMatchedRule(rules: any[], factIds: number[]): number | null {
    const matchedRules = rules.filter((rule) => {
      const conditionFactIds = rule.ruleConditions.map(
        (ruleCondition: any) => ruleCondition.factId,
      );

      return conditionFactIds.every((factId: number) =>
        factIds.includes(factId),
      );
    });

    if (matchedRules.length === 0) {
      return null;
    }

    matchedRules.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      if (a.ruleConditions.length !== b.ruleConditions.length) {
        return b.ruleConditions.length - a.ruleConditions.length;
      }

      return a.id - b.id;
    });

    const [bestRule] = matchedRules;
    const [ruleResult] = bestRule.ruleResults;

    return ruleResult?.conclusionId ?? null;
  }

  static async startConsultation(req: any): Promise<any> {
    const userId = req.user.id;

    const consultation = await prismaClient.consultation.create({
      data: {
        userId: userId,
      },
    });

    return consultation;
  }

  static async getConsultationQuestions(req: any): Promise<any> {
    const consultationId = Number(req.params.id);
    const userId = req.user.id;

    const consultation: any = await prismaClient.consultation.findFirst({
      where: { id: consultationId, userId },
    });

    if (!consultation) {
      throw new ResponseError(400, `Consultation is not found.`);
    }

    if (consultation.status !== "IN_PROGRESS") {
      throw new ResponseError(400, `Consultation is over.`);
    }

    const facts = await prismaClient.fact.findMany({
      select: {
        id: true,
        code: true,
        question: true,
        description: true,
      },
      where: {
        isActive: true,
      },
    });

    return facts;
  }

  // New priority-based chaining logic.
  // This method returns only the first matched rule result in priority order,
  // so the consultation ends with exactly one final conclusion.
  static async runPriorityChaining(factIds: number[]): Promise<number | null> {
    const rules = await prismaClient.rule.findMany({
      where: { isActive: true },
      orderBy: [{ priority: "asc" }, { id: "asc" }],
      include: {
        ruleConditions: true,
        ruleResults: true,
      },
    });

    return this.selectBestMatchedRule(rules, factIds);
  }

  // Legacy logic for multi-conclusion mode.
  // If you want to restore the old behavior, change the submitConsultationAnswer
  // flow to call runForwardChaining() and keep the array-based createMany() logic.
  static async runForwardChaining(factIds: number[]): Promise<any> {
    const rules = await prismaClient.rule.findMany({
      where: { isActive: true },
      include: {
        ruleConditions: true,
        ruleResults: true,
      },
    });

    const matchedConclusions = new Set<number>();

    for (const rule of rules) {
      const conditionFactIds = rule.ruleConditions.map(
        (ruleCondition) => ruleCondition.factId,
      );

      const isMatch = conditionFactIds.every((factId) =>
        factIds.includes(factId),
      );

      if (isMatch) {
        rule.ruleResults.forEach((ruleResult) => {
          matchedConclusions.add(ruleResult.conclusionId);
        });
      }
    }

    return Array.from(matchedConclusions);
  }

  static getComparisonConclusionCategory(data: any): string | null {
    const conclusion = data?.conclusions?.[0];

    if (!conclusion) {
      return null;
    }

    if (typeof conclusion === "string") {
      return conclusion;
    }

    return conclusion.category ?? conclusion?.conclusion?.category ?? null;
  }

  static mapConsultationComparisonData(consultation: any): any | null {
    if (!consultation) {
      return null;
    }

    return {
      consultationId: consultation.id,
      facts: (consultation.answers ?? []).map((answer: any) => ({
        code: answer.fact?.code,
        question: answer.fact?.question,
        fact: answer.fact?.fact,
      })),
      conclusions: (consultation.conclusions ?? []).map((item: any) => {
        const conclusion = item.conclusion ?? item;

        return {
          id: conclusion.id,
          code: conclusion.code,
          description: conclusion.description,
          category: conclusion.category,
          createdAt: conclusion.createdAt,
          isActive: conclusion.isActive,
          recommendations: (conclusion.recommendations ?? []).map(
            (recommendation: any) => ({
              id: recommendation.id,
              title: recommendation.title,
              content: recommendation.content,
              sourceId: recommendation.sourceId,
              createdAt: recommendation.createdAt,
              isActive: recommendation.isActive,
              conclusionId: recommendation.conclusionId,
            }),
          ),
        };
      }),
    };
  }

  static buildComparisonPayload(before: any, after: any, note?: string): any {
    const beforeConclusion = this.getComparisonConclusionCategory(before);
    const afterConclusion = this.getComparisonConclusionCategory(after);

    return {
      before: before ?? null,
      after: after ?? null,
      note:
        note ??
        `Perbandingan hasil konsultasi dari ${beforeConclusion ?? "sesi sebelumnya"} ke ${afterConclusion ?? "konsultasi terbaru"}.`,
      savedAt: new Date().toISOString(),
    };
  }

  static async saveComparisonForConsultation(
    tx: any,
    consultationId: number,
    userId: number,
    customData?: { before?: any; after?: any; note?: string },
  ): Promise<any | null> {
    const currentConsultation = await tx.consultation.findFirst({
      where: { id: consultationId, userId },
      include: {
        answers: {
          where: { value: true },
          include: { fact: true },
        },
        conclusions: {
          include: { conclusion: true },
        },
      },
    });

    if (!currentConsultation) {
      return null;
    }

    const previousConsultation = await tx.consultation.findFirst({
      where: {
        userId,
        status: ConsultationStatus.COMPLETED,
        id: { not: consultationId },
      },
      orderBy: { endedAt: "desc" },
      include: {
        answers: {
          where: { value: true },
          include: { fact: true },
        },
        conclusions: {
          include: { conclusion: true },
        },
      },
    });

    const beforeData =
      customData?.before ??
      this.mapConsultationComparisonData(previousConsultation);

    const afterData =
      customData?.after ??
      this.mapConsultationComparisonData(currentConsultation);

    const comparisonPayload = this.buildComparisonPayload(
      beforeData,
      afterData,
      customData?.note,
    );

    await tx.consultation.update({
      where: { id: consultationId },
      data: {
        comparisonNote: JSON.stringify(comparisonPayload),
      },
    });

    return comparisonPayload;
  }

  static async submitConsultationAnswer(req: any): Promise<any> {
    const consultationId = Number(req.params.id);
    const userId = req.user.id;
    const { answers } = req.body;

    try {
      const result = await prismaClient.$transaction(async (tx) => {
        const consultation = await tx.consultation.findFirst({
          where: { id: consultationId, userId },
        });

        if (!consultation) {
          throw new Error("NOT_FOUND");
        }

        if (consultation.status !== ConsultationStatus.IN_PROGRESS) {
          throw new Error("ALREADY_COMPLETED");
        }

        await tx.consultationAnswer.createMany({
          data: answers.map((a: any) => ({
            consultationId,
            factId: a.factId,
            value: a.value,
          })),
        });

        const trueFacts = answers
          .filter((a: any) => a.value === true)
          .map((a: any) => a.factId);

        const conclusionId = await this.runPriorityChaining(trueFacts);
        const conclusionIds = conclusionId !== null ? [conclusionId] : [];

        if (conclusionIds.length > 0) {
          await tx.consultationConclusion.createMany({
            data: conclusionIds.map((finalConclusionId: number) => ({
              consultationId,
              conclusionId: finalConclusionId,
            })),
          });
        }

        await tx.consultation.update({
          where: { id: consultationId },
          data: {
            status: "COMPLETED",
            endedAt: new Date(),
          },
        });

        const comparisonData = await this.saveComparisonForConsultation(
          tx,
          consultationId,
          userId,
        );

        return {
          conclusionIds,
          comparison: comparisonData,
        };
      });

      const response = {
        consultationId,
        status: "COMPLETED",
        conclusionIds: result.conclusionIds,
        comparison: result.comparison,
      };

      return response;
    } catch (error: any) {
      if (error.message === "NOT_FOUND") {
        throw new ResponseError(404, `Consultation is not found.`);
      }
      if (error.message === "ALREADY_COMPLETED") {
        throw new ResponseError(400, `Consultation is over.`);
      }

      throw new ResponseError(500, `Failed to Process Consultation`);
    }
  }

  static async saveComparisonNote(req: any): Promise<any> {
    const consultationId = Number(req.params.id);
    const userId = req.user.id;
    const { before, after, note } = req.body ?? {};

    if (!before && !after && !note) {
      throw new ResponseError(
        400,
        "Data perbandingan sebelum, sesudah, atau catatan wajib diisi.",
      );
    }

    const consultation = await prismaClient.consultation.findFirst({
      where: { id: consultationId, userId },
      select: { id: true },
    });

    if (!consultation) {
      throw new ResponseError(404, `Consultation is not found.`);
    }

    const comparisonData = this.buildComparisonPayload(
      before ?? null,
      after ?? null,
      note,
    );

    await prismaClient.consultation.update({
      where: { id: consultationId },
      data: {
        comparisonNote: JSON.stringify(comparisonData),
      },
    });

    return {
      consultationId,
      comparison: comparisonData,
    };
  }

  static async getConsultationResult(req: any): Promise<any> {
    const consultationId = Number(req.params.id);
    const userId = req.user.id;

    const consultation = await prismaClient.consultation.findFirst({
      where: { id: consultationId, userId },
      include: {
        answers: {
          where: { value: true },
          include: { fact: true },
        },
        conclusions: {
          include: {
            conclusion: {
              include: {
                recommendations: true,
              },
            },
          },
        },
      },
    });

    if (!consultation) {
      throw new ResponseError(404, `Consultation is not found.`);
    }

    if (consultation.status !== "COMPLETED") {
      throw new ResponseError(400, "consultation has not yet been completed.");
    }

    const comparison = consultation.comparisonNote
      ? JSON.parse(consultation.comparisonNote)
      : null;

    const response = {
      consultationId,
      facts: consultation.answers.map((a) => ({
        code: a.fact.code,
        fact: a.fact.fact,
      })),
      conclusions: consultation.conclusions.map((c) => c.conclusion),
      comparison,
    };

    return response;
  }

  static async getLatestConsultationResult(req: any): Promise<any> {
    const userId = req.user.id;
    const consultation = await prismaClient.consultation.findFirst({
      where: { userId, status: "COMPLETED" },
      orderBy: { endedAt: "desc" },
      include: {
        answers: {
          where: { value: true },
          include: { fact: true },
        },
        conclusions: {
          include: {
            conclusion: {
              include: {
                recommendations: true,
              },
            },
          },
        },
      },
    });

    if (!consultation) {
      throw new ResponseError(404, `Consultation is not found.`);
    }

    const comparison = consultation.comparisonNote
      ? JSON.parse(consultation.comparisonNote)
      : null;

    const response = {
      comparison: {
        before: comparison?.before ?? null,
        after: comparison?.after ?? null,
      },
      note: comparison?.note ?? null,
      savedAt: comparison?.savedAt ?? null,
    };

    return response;
  }

  static async getConsultationHistory(req: any): Promise<any> {
    const userId = Number(req.user.id);
    const params = req?.query as unknown as TGetList;

    const page = Number(params.page);
    const limit = Number(params.limit);
    // const search = params.search;

    const searchCondition = {
      userId: userId,
    };

    const [total, consultations] = await prismaClient.$transaction([
      prismaClient.consultation.count({ where: searchCondition }),
      prismaClient.consultation.findMany({
        orderBy: { startedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        where: searchCondition,
        include: {
          conclusions: {
            include: {
              conclusion: {
                select: {
                  id: true,
                  code: true,
                  description: true,
                  category: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      consultations,
      total,
    };
  }

  static async getUserConsultationStatus(req: any): Promise<any> {
    const userId = Number(req.user.id);

    const consultation = await prismaClient.consultation.findFirst({
      where: { userId, status: "IN_PROGRESS" },
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        status: true,
        startedAt: true,
        endedAt: true,
      },
    });

    return consultation;
  }
}
