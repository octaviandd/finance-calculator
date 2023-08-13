/** @format */

import { Input } from "@mui/joy";
import React from "react";
import { Income } from "../types/Income";
import { Expense } from "../types/Expense";
import { Currency } from "../types/Currency";

type Props = {
  row: Income | Expense;
  currency: Currency;
};

export default function AmountSelector({ row, currency }: Props) {
  return (
    <>
      {row.status === "new" ? (
        <Input
          type="number"
          id="amount"
          name="amount"
          required
          startDecorator={
            {
              pound: currency.symbol,
              dollar: currency.symbol,
              euro: currency.symbol,
            }[currency.title]
          }
        />
      ) : (
        <Input
          type="number"
          id="amount"
          name="amount"
          value={parseFloat((row.actual_amount * currency.rate).toFixed(2))}
          startDecorator={
            {
              pound: currency.symbol,
              dollar: currency.symbol,
              euro: currency.symbol,
            }[currency.title]
          }
        />
      )}
    </>
  );
}
