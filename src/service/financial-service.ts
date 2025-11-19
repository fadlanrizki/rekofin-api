import { prismaClient } from "../application/database";
import { TAddFinancial } from "../model/financial-model";

export class FinancialService {
  static async create(request: TAddFinancial): Promise<any> {
    return prismaClient.financial.create({
      data: {
        userId: request.userId,
        monthlyIncome: request.monthlyIncome,
        totalSavings: request.totalSavings,
        emergencyFund: request.emergencyFund,
        debt: request.debt,
        monthlyExpenses: request.monthlyExpenses,
        riskProfile: request.riskProfile,
        financialPrinciple: request.financialPrinciple,
        investment: request.investment
      },
    });
  }
}
