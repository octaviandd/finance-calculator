/** @format */

import { FormControl, FormLabel, Select, Option, Button } from "@mui/joy";
import React from "react";
import { PlusCircle } from "react-feather";
import { Category } from "../types/Category";

type Props = {
  addRow: Function | undefined;
  categories: Category[];
};

export const Filters = ({ addRow, categories }: Props) => {
  return (
    <React.Fragment>
      {/* <FormControl size="sm" sx={{ display: "flex", alignItems: "center" }}>
        <FormLabel>Status</FormLabel>
        <Select
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
        >
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
          <Option value="refunded">Refunded</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Category</FormLabel>
        <Select placeholder="All">
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.title}
            </Option>
          ))}
        </Select>
      </FormControl> */}

      <FormControl size="sm" sx={{ marginLeft: "auto" }}>
        {addRow && (
          <Button variant="soft" sx={{ marginTop: "auto" }}>
            <PlusCircle onClick={() => addRow()}></PlusCircle>
          </Button>
        )}
      </FormControl>
    </React.Fragment>
  );
};
