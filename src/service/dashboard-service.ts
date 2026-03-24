import { prismaClient } from "../application/database";
import { ConsultationStatus } from "../generated/prisma";
import { getCountOfWeeklyDataChart, getCurrentWeekRange } from "../utils/date";

type TRecommendation = {
  id: number;
  title: string;
  content: string;
};

type TConclusion = {
  id: number;
  code: string;
  description: string;
  category: string;
  recommendations: TRecommendation[];
};

type TConsultationHistory = {
  id: number;
  status: string;
  startedAt: string;
  endedAt: string;
  conclusions: { conclusion: TConclusion }[];
};

type TUserDashboardData = {
  totalConsultation: number;
  lastConsultationDate: string | null;
  lastConsultation: TConsultationHistory | null;
  recentHistories: TConsultationHistory[];
};

export class DashboardService {
  static async getAdminDashboard(): Promise<any> {
    const totalUser = await prismaClient.user.count({
      where: { isActive: true },
    });

    const totalConsultation = await prismaClient.consultation.count();

    const totalConsultationComplete = await prismaClient.consultation.count({
      where: { status: ConsultationStatus.COMPLETED },
    });

    const totalConsultationInProgress = await prismaClient.consultation.count({
      where: { status: ConsultationStatus.IN_PROGRESS },
    });

    const totalFact = await prismaClient.fact.count({
      where: { isActive: true },
    });

    const totalRule = await prismaClient.rule.count({
      where: { isActive: true },
    });

    const { monday, sunday } = getCurrentWeekRange();

    const numberOfWeeklyConsultationChart =
      await prismaClient.consultation.findMany({
        select: {
          startedAt: true,
        },
        where: { startedAt: { gte: monday, lte: sunday } },
      });

    const formattedListConsultation = getCountOfWeeklyDataChart(
      numberOfWeeklyConsultationChart.map((item) => item.startedAt),
    );

    const response = {
      count: {
        user: totalUser,
        rule: totalRule,
        fact: totalFact,
        consultation: totalConsultation,
        complete_consultation: totalConsultationComplete,
        inprogress_consultation: totalConsultationInProgress,
      },
      number_of_weekly_consultation_chart: {
        data: formattedListConsultation,
      },
      consultation_result_chart: {
        data: [],
      },
      fulfilled_rule_chart: {
        data: [],
      },
      last_consultation_list: [],
    };

    return response;
  }

  static async getUserDashboard(req: any): Promise<TUserDashboardData> {
    const userId = req.user.id;

    const totalConsultation = await prismaClient.consultation.count({
      where: { userId },
    });

    const historyConsultation = await prismaClient.consultation.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        startedAt: true,
        endedAt: true,
        conclusions: {
          select: {
            conclusion: {
              select: {
                id: true,
                code: true,
                description: true,
                category: true,
                recommendations: {
                  select: {
                    id: true,
                    title: true,
                    content: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const recentHistories: TConsultationHistory[] = historyConsultation.map(
      (consultation) => ({
        id: consultation.id,
        status: consultation.status,
        startedAt: consultation.startedAt.toISOString(),
        endedAt: consultation.endedAt?.toISOString() ?? "",
        conclusions: consultation.conclusions.map((item) => ({
          conclusion: {
            id: item.conclusion.id,
            code: item.conclusion.code,
            description: item.conclusion.description,
            category: item.conclusion.category,
            recommendations: item.conclusion.recommendations.map(
              (recommendation) => ({
                id: recommendation.id,
                title: recommendation.title,
                content: recommendation.content,
              }),
            ),
          },
        })),
      }),
    );

    const lastConsultation = recentHistories[0] ?? null;

    const response = {
      totalConsultation,
      lastConsultationDate: lastConsultation?.startedAt ?? null,
      lastConsultation,
      recentHistories,
    };

    return response;
  }
}
