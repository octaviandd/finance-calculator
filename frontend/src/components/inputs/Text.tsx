/** @format */

import { Input } from "@mui/joy";
import React, { useEffect, useState } from "react";

type Props = {
  input: string;
  onChange?: Function;
};

export default function TextInput({ input, onChange }: Props) {
  const [value, setValue] = useState("");
  const handleChange = (value: string) => {
    setValue(value);
    if (typeof onChange === "function") onChange(value) && setValue("");
  };

  useEffect(() => {
    if (input) {
      setValue(input);
    }
  }, [input]);

  return (
    <Input
      id="title"
      name="title"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
