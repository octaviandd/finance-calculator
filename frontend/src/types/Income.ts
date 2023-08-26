/** @format */

import { Category } from "./Category";
export type Income = {
  id: number | string;
  title: string;
  date: Date;
  status: "new" | "created";
  amount: number;
  category: Category;
};
