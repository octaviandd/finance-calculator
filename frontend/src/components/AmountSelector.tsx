/** @format */

import { Input } from "@mui/joy";
import React from "react";
import { Currency } from "../types/Currency";

type Props = {
  amount?: number;
  currency: Currency;
  onChange?: Function;
  placeholder?: string;
  slotProps?: object;
  id: string;
  name: string;
  required: boolean;
  variant: any;
};

export default function AmountSelector({
  amount,
  currency,
  placeholder,
  onChange,
  slotProps,
  id,
  name,
  required,
  variant,
}: Props) {
  const handleChange = onChange ? onChange : () => {};
  return (
    <Input
      type="number"
      id={id}
      variant={variant}
      name={name}
      onChange={(e) => handleChange(e.target.value)}
      slotProps={slotProps || {}}
      required={required || false}
      placeholder={placeholder || ""}
      value={amount ? parseFloat((amount * currency.rate).toFixed(2)) : 0}
      startDecorator={
        {
          pound: currency.symbol,
          dollar: currency.symbol,
          euro: currency.symbol,
        }[currency.title]
      }
    />
  );
}
