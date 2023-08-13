/** @format */

import { Category } from "./Category";
export type Income = {
  id: number | string;
  title: string;
  date: Date;
  status: "new" | "created";
  planned_amount: number | string;
  actual_amount: number;
  category: Category;
};
