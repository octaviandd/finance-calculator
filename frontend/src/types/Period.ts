/** @format */

import { MonthlyPeriod } from "./MonthlyPeriod";

export type Period = {
  id: number | string;
  title: string;
  total_saved: number;
  monthly_periods: MonthlyPeriod[];
};
