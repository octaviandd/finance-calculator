/** @format */

import React, { useContext } from "react";
import { Stack } from "@mui/joy";
import { MonthlyPeriod } from "../../types/MonthlyPeriod";
import { Store } from "../../Store";

type Props = {
  period: MonthlyPeriod;
  totalSaved: number;
};

export default function ReportDisplay({ period, totalSaved }: Props) {
  const { currency } = useContext(Store);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={12}
      marginBottom="8rem"
      marginTop="8rem"
    >
      <div className="max-w-[400px] gap-x-4 flex items-center">
        <div>
          <div className="bg-[#334960] max-h-[400px] h-[200px] w-[70px] ml-auto"></div>
          <div className="font-medium">
            <p className="text-xl text-[#334960]">START BALANCE</p>
            <p className="text-right text-[#334960] italic">
              {currency.symbol}
              {(period.start_balance * currency.rate).toFixed(2)}
            </p>
          </div>
        </div>
        <div>
          <div className="bg-[#F46524] max-h-[400px] h-[200px] w-[70px] mr-auto"></div>
          <div className="font-medium">
            <p className="text-xl text-[#F46524]">END BALANCE</p>
            <p className="italic text-[#F46524]">
              {currency.symbol}
              {(period.monthly_end_balance * currency.rate).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="py-10 px-20 bg-[#ECEDEF]">
        <div className="border-b border-dashed border-neutral-400 pb-5">
          <p className="text-3xl text-center">
            {currency.symbol}
            {(totalSaved * currency.rate).toFixed(2)}
          </p>
          <p className="text-center">Increase in total savings</p>
          <p>
            <small>Accumulated from the months of the current year</small>
          </p>
        </div>
        <div className="pt-6">
          <p className="text-3xl text-center">
            {currency.symbol}
            {(period.monthly_saved_this_month * currency.rate).toFixed(2)}
          </p>
          <p className="text-center">Saved this month</p>
        </div>
      </div>
    </Stack>
  );
}
