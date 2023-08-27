/** @format */

import { FormControl, Select, Option } from "@mui/joy";
import React, { useState } from "react";
import { Category } from "../../types/Category";
import { Expense } from "../../types/Expense";
import { Income } from "../../types/Income";

type Props = {
  categories: Category[];
  row: Expense | Income;
  onChange?: Function;
};

export default function SelectInput({ categories, row, onChange }: Props) {
  const [currentCategory, setCurrentCategory] = useState("");
  const handleChange = (value: string) => {
    setCurrentCategory(value);
    onChange && onChange(value);
  };

  console.log(categories, row);

  return (
    <>
      <FormControl>
        <Select
          placeholder="All"
          id="category"
          name="category"
          onChange={(_, newValue) => handleChange(newValue as string)}
          value={
            currentCategory
              ? currentCategory
              : categories.find((category) => category.id == row.category.id)
                  ?.id
          }
        >
          {categories.map((category) => (
            <Option
              key={category.id}
              value={category.id}
              label={category.title}
            >
              {category.title}
            </Option>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
