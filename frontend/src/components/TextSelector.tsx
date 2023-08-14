/** @format */

import { Input } from "@mui/joy";
import React from "react";
import { Income } from "../types/Income";
import { Expense } from "../types/Expense";
import { Category } from "../types/Category";

type Props = {
  row: Income | Expense | Category;
};

export default function TextSelector({ row }: Props) {
  return (
    <>
      {row.status === "new" ? (
        <Input id="title" name="title" required />
      ) : (
        <Input id="title" name="title" value={row.title} />
      )}
    </>
  );
}
