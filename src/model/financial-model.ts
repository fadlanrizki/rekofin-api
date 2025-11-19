import { FinancialPrinciple, RiskProfile } from "../generated/prisma";

export type TAddFinancial = {
  userId: number;
  monthlyIncome: number;
  totalSavings: number;
  emergencyFund: number;
  debt: number;
  monthlyExpenses: number;
  riskProfile: RiskProfile;
  financialPrinciple: FinancialPrinciple;
  investment: number
};
