/** @format */

import { FormControl, Select, Option } from "@mui/joy";
import React, { useState } from "react";
import { Category } from "../types/Category";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";

type Props = {
  categories: Category[];
  row: Expense | Income;
};

export default function CategorySelector({ categories, row }: Props) {
  const [currentCategory, setCurrentCategory] = useState("");
  return (
    <>
      {row.status === "new" ? (
        <FormControl size="sm">
          <Select placeholder="All" id="category" name="category">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.title}
              </Option>
            ))}
          </Select>
        </FormControl>
      ) : (
        <FormControl size="sm">
          <Select
            id="category"
            name="category"
            value={
              currentCategory ||
              categories.find((category) => category.id == row.category.id)?.id
            }
            onChange={(_, newValue) => setCurrentCategory(newValue as string)}
          >
            {categories.map((category) => (
              <Option
                key={category.id}
                label={category.title}
                value={category.id}
              >
                {category.title}
              </Option>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
}
