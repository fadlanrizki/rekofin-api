import { prismaClient } from "../application/database";
import { ConsultationStatus } from "../generated/prisma";

type TConsultationResultCategory = {
  category: string;
  value: number;
};

type TConsultationResultByMonth = {
  category: string;
  value: Array<number | null>;
};

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
    const totalFact = await prismaClient.fact.count({
      where: { isActive: true },
    });
    const totalRule = await prismaClient.rule.count({
      where: { isActive: true },
    });

    const consultationResultData =
      await prismaClient.consultationConclusion.findMany({
        where: {
          consultation: {
            status: ConsultationStatus.COMPLETED,
            endedAt: {
              not: null,
            },
          },
        },
        select: {
          consultation: {
            select: {
              endedAt: true,
            },
          },
          conclusion: {
            select: {
              category: true,
            },
          },
        },
      });

    const categoryCountMap = new Map<string, number>();
    const categoryMonthlyMap = new Map<string, Array<number | null>>();
    const currentMonthIndex = new Date().getMonth();

    const getInitialMonthlyValues = (): Array<number | null> =>
      Array.from({ length: 12 }, (_, monthIndex) =>
        monthIndex <= currentMonthIndex ? 0 : null,
      );

    for (const item of consultationResultData) {
      const category = item.conclusion.category;
      const endedAt = item.consultation.endedAt;

      categoryCountMap.set(category, (categoryCountMap.get(category) ?? 0) + 1);

      if (!categoryMonthlyMap.has(category)) {
        categoryMonthlyMap.set(category, getInitialMonthlyValues());
      }

      if (endedAt) {
        const monthIndex = endedAt.getMonth();
        const monthlyValue = categoryMonthlyMap.get(category)!;
        const currentValue = monthlyValue[monthIndex] ?? 0;
        monthlyValue[monthIndex] = currentValue + 1;
      }
    }

    const consultationResultCategories: TConsultationResultCategory[] =
      Array.from(categoryCountMap.entries())
        .map(([category, value]) => ({
          category,
          value,
        }))
        .sort(
          (a, b) => b.value - a.value || a.category.localeCompare(b.category),
        );

    const consultationResultByMonth: TConsultationResultByMonth[] =
      consultationResultCategories.map(({ category }) => ({
        category,
        value: categoryMonthlyMap.get(category) ?? getInitialMonthlyValues(),
      }));

    const response = {
      dashboard: {
        total_user: totalUser,
        total_rule: totalRule,
        total_fact: totalFact,
        total_consultation: totalConsultation,
      },
      chart: {
        consultation_result_categories: consultationResultCategories,
        consultation_result_by_month: consultationResultByMonth,
      },
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
        consultationId: true,
        status: true,
        startedAt: true,
        endedAt: true,
        conclusions: {
          select: {
            conclusion: {
              select: {
                conclusionId: true,
                code: true,
                description: true,
                category: true,
                recommendations: {
                  select: {
                    recommendationId: true,
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
        id: consultation.consultationId,
        status: consultation.status,
        startedAt: consultation.startedAt.toISOString(),
        endedAt: consultation.endedAt?.toISOString() ?? "",
        conclusions: consultation.conclusions.map((item) => ({
          conclusion: {
            id: item.conclusion.conclusionId,
            code: item.conclusion.code,
            description: item.conclusion.description,
            category: item.conclusion.category,
            recommendations: item.conclusion.recommendations.map(
              (recommendation) => ({
                id: recommendation.recommendationId,
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
