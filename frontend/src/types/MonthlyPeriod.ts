/** @format */

import { Category } from "./Category";
import { Expense } from "./Expense";
import { Income } from "./Income";
export type MonthlyPeriod = {
  id: number | string;
  title: string;
  from_date: Date;
  to_date: Date;
  total_spend: number;
  start_balance: number;
  monthly_end_balance: number;
  monthly_saved_this_month: number;
  monthly_total_actual_expenses_amount: number;
  monthly_total_actual_incomes_amount: number;
  monthly_total_planned_expenses_amount: number;
  monthly_total_planned_incomes_amount: number;
  income_categories: Category[];
  expense_categories: Category[];
  incomes: Income[];
  expenses: Expense[];
  [key: string]: any;
};
