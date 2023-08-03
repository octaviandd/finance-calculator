/** @format */

import { MonthlyPeriod } from "./MonthlyPeriod";

export type Period = {
  id: number | string;
  title: string;
  monthly_periods: MonthlyPeriod[];
};
