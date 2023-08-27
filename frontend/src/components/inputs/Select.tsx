/** @format */

import { FormControl, Select, Option } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Category } from "../../types/Category";

type Props = {
  categories: Category[];
  categoryId: string;
};

export default function SelectInput({ categories, categoryId }: Props) {
  const [currentCategory, setCurrentCategory] = useState<string>();
  const handleChange = (value: string) => {
    setCurrentCategory(
      categories.find((category) => category.id === value)?.id
    );
  };

  useEffect(() => {
    console.log(categoryId, categories);
    if (categoryId) {
      setCurrentCategory(
        categories.find((category) => category.id === categoryId)?.id
      );
    }
  }, [categoryId]);

  return (
    <>
      <FormControl>
        <Select
          placeholder="All"
          id="category"
          name="category"
          onChange={(_, newValue) => newValue && handleChange(newValue)}
          value={currentCategory}
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
