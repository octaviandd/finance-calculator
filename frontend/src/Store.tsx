/** @format */

import React, { ReactNode, createContext, useState } from "react";
import { Currency } from "./types/Currency";

export const Store = createContext<{
  currency: Currency;
  setGlobalCurrency: Function;
}>({
  currency: {
    id: "1",
    title: "Sterling Pound",
    label: "pound",
    symbol: "£",
    rate: 1,
    code: "GBP",
  },
  setGlobalCurrency: () => undefined,
});

export default function StoreProvider({ children }: { children: ReactNode }) {
  const initialCurrency = localStorage.getItem("currency")
    ? JSON.parse(localStorage.getItem("currency") as string)
    : {
        id: "1",
        title: "Sterling Pound",
        label: "pound",
        symbol: "£",
        rate: 1,
        currency: "GBP",
      };
  const [currency, setCurrency] = useState(initialCurrency);

  const setGlobalCurrency = (currency: Currency) => {
    localStorage.setItem("currency", JSON.stringify(currency));
    setCurrency(currency);
  };

  return (
    <Store.Provider
      value={{
        currency,
        setGlobalCurrency,
      }}
    >
      {children}
    </Store.Provider>
  );
}
