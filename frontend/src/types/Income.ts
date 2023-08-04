/** @format */

import { Category } from "./Category";
export type Income = {
  id: number | string;
  title: string;
  description: string;
  planned_amount: number;
  target: string;
  date: Date;
  status: "new" | "created";
  actual_amount: number;
  category: Category;
};
