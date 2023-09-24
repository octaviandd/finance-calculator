/** @format */

import React from "react";
import { Expense } from "../../types/Expense";
import { Income } from "../../types/Income";
import { Input } from "@mui/joy";
import dayjs from "dayjs";

type Props = {
  item: Expense | Income;
};

export default function DateInput({ item }: Props) {
  return (
    <>
      <Input
        type="date"
        id="date"
        name="date"
        value={item.date ? dayjs(item.date).format("YYYY-MM-DD") : ""}
      />
    </>
  );
}
