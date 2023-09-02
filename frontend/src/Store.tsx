/** @format */

import React, { ReactNode, createContext, useState } from "react";
import { Currency } from "./types/Currency";

export const Store = createContext<{
  currency: Currency;
  setCurrency: Function;
}>({
  currency: {
    id: "1",
    title: "pound",
    symbol: "£",
    rate: 1,
    code: "GBP",
  },
  setCurrency: () => undefined,
});

export default function StoreProvider({ children }: { children: ReactNode }) {
  const initialCurrency = localStorage.getItem("currency")
    ? JSON.parse(localStorage.getItem("currency") as string)
    : {
        id: "1",
        title: "pound",
        symbol: "£",
        rate: 1,
        currency: "GBP",
      };
  const [currency, setCurrency] = useState(initialCurrency);

  return (
    <Store.Provider
      value={{
        currency,
        setCurrency,
      }}
    >
      {children}
    </Store.Provider>
  );
}
