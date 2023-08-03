/** @format */

import React, { useEffect, useState } from "react";
import PeriodContainer from "../components/PeriodContainer";
import { serverRequest } from "../utils/utils";
import { Period } from "../types/Period";
import { MonthlyPeriod } from "../types/MonthlyPeriod";

type Props = {};

export default function Periods({}: Props) {
  const [error, setError] = useState(false);
  const [periods, setPeriods] = useState<Period[]>();

  useEffect(() => {
    serverRequest(
      "get",
      `finance/periods`,
      undefined,
      (data: Period[]) => {
        setPeriods(data);
      },
      setError
    );
  }, []);

  return (
    <div className="flex flex-wrap gap-4 items-center space-between">
      {periods &&
        periods.map((period) =>
          period.monthly_periods.map((item: MonthlyPeriod) => (
            <PeriodContainer key={item.id} period={item} />
          ))
        )}
    </div>
  );
}
