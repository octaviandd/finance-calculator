/** @format */

import PeriodContainer from "./PeriodContainer";
import { Period } from "../../types/Period";
import { MonthlyPeriod } from "../../types/MonthlyPeriod";

export default function Periods({ period }: { period: Period }) {
  return (
    <div className="flex flex-wrap gap-4 items-center space-between">
      {period &&
        period.monthly_periods
          .sort(
            (a: MonthlyPeriod, b: MonthlyPeriod) =>
              (a.id as number) - (b.id as number)
          )
          .map((item: MonthlyPeriod) => (
            <PeriodContainer key={item.id} period={item} />
          ))}
    </div>
  );
}
