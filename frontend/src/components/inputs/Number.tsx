/** @format */

import { Input } from "@mui/joy";
import React, { useContext, useEffect, useState } from "react";
import { Currency } from "../../types/Currency";
import { Store } from "../../Store";

type Props = {
  amount?: string;
  onChange?: Function;
  placeholder?: string;
  slotProps?: object;
  id: string;
  name: string;
  required: boolean;
  variant: any;
};

export default function NumberInput({
  amount = "",
  placeholder = "0",
  onChange,
  slotProps = {},
  id,
  name,
  required = false,
  variant,
}: Props) {
  const { currency } = useContext(Store);
  const [value, setValue] = useState("0");
  const handleChange = (value: string) => {
    setValue(value);
    onChange && onChange(value);
  };

  useEffect(() => {
    if (amount) {
      setValue(amount);
    }
  }, [amount]);

  return (
    <Input
      type="number"
      id={id}
      variant={variant}
      name={name}
      onChange={(e) => handleChange(e.target.value)}
      slotProps={slotProps}
      required={required}
      placeholder={placeholder}
      value={value}
      startDecorator={
        {
          pound: currency.symbol,
          dollar: currency.symbol,
          euro: currency.symbol,
        }[currency.label]
      }
    />
  );
}
