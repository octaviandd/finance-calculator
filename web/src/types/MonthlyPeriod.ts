/** @format */

import { Expense } from "./Expense";
import { Income } from "./Income";
export type MonthlyPeriod = {
  id: number | string;
  title: string;
  total_spend: number;
  total_savings: number;
  from_date: Date;
  to_date: Date;
  total_saved_this_period: number;
  start_balance: number;
  end_balance: number;
  total_income: number;
  incomes: Income[];
  expenses: Expense[];
};
