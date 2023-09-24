/** @format */

import React, { useContext, useEffect, useState } from "react";
import { Box, Stack } from "@mui/joy";
import { MonthlyPeriod } from "../../types/MonthlyPeriod";
import { Store } from "../../Store";

type Props = {
  period: MonthlyPeriod;
  totalSaved: number;
};

export default function ReportDisplay({ period, totalSaved }: Props) {
  const { currency } = useContext(Store);
  const [startBalancePercentage, setStartBalancePercentage] =
    useState<number>(0);
  const [endBalancePercentage, setEndBalancePercentage] = useState<number>(0);

  useEffect(() => {
    if (period.start_balance > period.monthly_end_balance) {
      let difference = period.start_balance - period.monthly_end_balance;
      let percentage = (difference / period.monthly_end_balance) * 100;
      setStartBalancePercentage(parseFloat(percentage.toFixed(2)));
    } else if (period.start_balance < period.monthly_end_balance) {
      let difference = period.monthly_end_balance - period.start_balance;
      let percentage = (difference / period.monthly_end_balance) * 100;
      setEndBalancePercentage(parseFloat(percentage.toFixed(2)));
    }
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={12}
      marginBottom="4"
      marginTop="4"
    >
      <Box
        sx={{
          maxHeight: "400px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "6px",
        }}
      >
        <div className="h-[300px] flex items-end justify-end">
          <Box
            className="bg-[#334960] h-[200px] w-[70px]"
            sx={{ height: `calc(66.67% - ${endBalancePercentage}%)` }}
          ></Box>
        </div>
        <div className="h-[300px] flex items-end">
          <Box
            className="bg-[#F46524] w-[70px]"
            sx={{ height: `calc(66.67% - ${startBalancePercentage}%)` }}
          ></Box>
        </div>
        <div className="font-medium">
          <p className="text-xl text-[#334960]">START BALANCE</p>
          <p className="text-right text-[#334960] italic">
            {currency.symbol}
            {period.start_balance.toFixed(2)}
          </p>
        </div>
        <div className="font-medium">
          <p className="text-xl text-[#F46524]">END BALANCE</p>
          <p className="italic text-[#F46524]">
            {currency.symbol}
            {(period.monthly_end_balance * currency.rate).toFixed(2)}
          </p>
        </div>
      </Box>
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
