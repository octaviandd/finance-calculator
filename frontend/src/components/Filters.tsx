/** @format */

import { FormControl, FormLabel, Select, Option, Button } from "@mui/joy";
import React from "react";
import { PlusCircle } from "react-feather";

type Props = {
  addRow: Function | undefined;
};

export const Filters = ({ addRow }: Props) => {
  return (
    <React.Fragment>
      <FormControl size="sm" sx={{ display: "flex", alignItems: "center" }}>
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
          <Option value="all">All</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Customer</FormLabel>
        {addRow && (
          <Button variant="plain" sx={{ margin: 0 }}>
            <PlusCircle onClick={() => addRow()}></PlusCircle>
          </Button>
        )}
      </FormControl>
    </React.Fragment>
  );
};
