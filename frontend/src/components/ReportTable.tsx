/** @format */

import React, { useContext, useState } from "react";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { Order } from "../types/Order";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { ArrowDown } from "react-feather";
import { Store } from "../Store";

export default function ReportTable({
  items,
  setPlannedAmount,
}: {
  items: Expense[] | Income[];
  setPlannedAmount: Function;
}) {
  const [order, setOrder] = React.useState<Order>("desc");
  const { currency } = useContext(Store);

  return (
    <Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "md",
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": (theme) =>
              theme.vars.palette.background.level1,
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": (theme) =>
              theme.vars.palette.background.level1,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 160, padding: 12 }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  fontWeight="lg"
                  endDecorator={<ArrowDown width={16} height={16} />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  }}
                >
                  Title
                </Link>
              </th>
              <th style={{ width: 160, padding: 12 }}>Planned</th>
              <th style={{ width: 160, padding: 12 }}>Actual</th>
              <th
                style={{
                  width: "100%",
                  padding: 12,
                  textAlign: "right",
                  paddingRight: "50px",
                }}
              >
                Diff
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td style={{ paddingLeft: "15px" }}>{row.category.title}</td>
                <td>
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    variant="plain"
                    slotProps={{
                      input: {
                        precision: 2,
                        step: 0.01,
                      },
                    }}
                    value={Number(row.planned_amount).toFixed(2)}
                    onChange={(e) => setPlannedAmount(row.id, e.target.value)}
                    required
                    startDecorator={
                      {
                        pound: currency.symbol,
                        dollar: currency.symbol,
                        euro: currency.symbol,
                      }[currency.title]
                    }
                  />
                </td>
                <td>
                  {currency.symbol}
                  {row.actual_amount.toFixed(2)}
                </td>
                <td style={{ textAlign: "right", paddingRight: "50px" }}>
                  £
                  {(
                    Number(row.planned_amount) - Number(row.actual_amount)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
