import { Request } from "express";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { ConsultationStatus } from "../generated/prisma";
export class ConsultationService {
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
      },
    });

    return facts;
  }

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
        (ruleCondition) => ruleCondition.factId
      );

      const isMatch = conditionFactIds.every((factId) =>
        factIds.includes(factId)
      );

      if (isMatch) {
        rule.ruleResults.forEach((ruleResult) => {
          matchedConclusions.add(ruleResult.conclusionId);
        });
      }
    }

    return Array.from(matchedConclusions);
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

        // save answer
        await tx.consultationAnswer.createMany({
          data: answers.map((a: any) => ({
            consultationId,
            factId: a.factId,
            value: a.value,
          })),
        });

        // get true fact
        const trueFacts = answers
          .filter((a: any) => a.value === true)
          .map((a: any) => a.factId);

        // Forward chaining
        const conclusionIds = await this.runForwardChaining(trueFacts);

        // save conclusion
        if (conclusionIds.length > 0) {
          await tx.consultationConclusion.createMany({
            data: conclusionIds.map((conclusionId: number) => ({
              consultationId,
              conclusionId: conclusionId,
            })),
          });
        }

        // Update status
        await tx.consultation.update({
          where: { id: consultationId },
          data: {
            status: "COMPLETED",
            endedAt: new Date(),
          },
        });

        return conclusionIds;
      });

      const response = {
        consultationId,
        status: "COMPLETED",
        conclusionIds: result,
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

    const response = {
      consultationId,
      facts: consultation.answers.map((a) => ({
        code: a.fact.code,
        question: a.fact.question,
      })),
      conclusions: consultation.conclusions.map((c) => c.conclusion),
    };

    return response;
  }
}
