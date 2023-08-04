/** @format */

import { Category } from "./Category";

export type Expense = {
  id: number | string;
  title: string;
  description: string;
  date: Date;
  target: string;
  status: "new" | "created";
  planned_amount: number;
  actual_amount: number;
  category: Category;
};
