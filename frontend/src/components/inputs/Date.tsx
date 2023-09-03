/** @format */

import React from "react";
import { Expense } from "../../types/Expense";
import { Income } from "../../types/Income";
import { Input } from "@mui/joy";
import dayjs from "dayjs";

type Props = {
  row: Expense | Income;
};

export default function DateInput({ row }: Props) {
  return (
    <>
      <Input
        type="date"
        id="date"
        name="date"
        value={row.date ? dayjs(row.date).format("YYYY-MM-DD") : ""}
      />
    </>
  );
}
