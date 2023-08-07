/** @format */

import React, { ReactNode, createContext, useState } from "react";

export const Store = createContext<{
  currency: { title: string; symbol: string; rate: number; currency: string };
  setCurrency: Function;
}>({
  currency: {
    title: "pound",
    symbol: "£",
    rate: 1,
    currency: "GBP",
  },
  setCurrency: () => undefined,
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
