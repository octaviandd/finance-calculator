/** @format */

import { Expense } from "./Expense";
import { Income } from "./Income";
export type MonthlyPeriod = {
  id: number | string;
  title: string;
  total_spend: number;
  total_savings: number;
  total_saved_this_period: number;
  start_balance: number;
  end_balance: number;
  actual_amount: number;
  incomes: Income[];
  expenses: Expense[];
};
