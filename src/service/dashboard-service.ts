import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { ConsultationStatus } from "../generated/prisma";
import { formatDataChart } from "../utils/chart/dataFormat";
import {
  DAYS,
  getCountOfWeeklyDataChart,
  getCurrentWeekRange,
  listWeeklyChart,
} from "../utils/date";

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

    const consultationResultChart =
      await prismaClient.consultationConclusion.findMany({
        include: {
          conclusion: {
            select: {
              category: true,
            },
          },
        },
      });

    console.log("consultationResultChart > ", consultationResultChart);

    // const formattedConsultationResultChart = formatDataChart(
    //   consultationResultChart,
    //   "status",
    //   "_count.id",
    // );

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

  static async getUserDashboard(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }
}
