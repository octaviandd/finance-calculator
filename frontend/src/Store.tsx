/** @format */

import React, { ReactNode, createContext, useState } from "react";
import { Currency } from "./types/Currency";

export const Store = createContext<{
  currency: Currency;
  setCurrency: Function;
  getAmountWithRate: Function;
}>({
  currency: {
    title: "pound",
    symbol: "£",
    rate: 1,
    currency: "GBP",
  },
  setCurrency: () => undefined,
  getAmountWithRate: () => undefined,
});

export default function StoreProvider({ children }: { children: ReactNode }) {
  const initialCurrency = localStorage.getItem("currency")
    ? JSON.parse(localStorage.getItem("currency") as string)
    : {
        title: "pound",
        symbol: "£",
        rate: 1,
        currency: "GBP",
      };
  const [currency, setCurrency] = useState(initialCurrency);

  const getAmountWithRate = (amount: number | string) => {
    if (typeof amount === "string") {
      amount = parseFloat(amount);
    }

    return (amount * currency.rate).toFixed(2);
  };

  return (
    <Store.Provider
      value={{
        currency,
        setCurrency,
        getAmountWithRate,
      }}
    >
      {children}
    </Store.Provider>
  );
}
