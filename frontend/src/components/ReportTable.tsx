/** @format */

import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { stableSort, getComparator, serverRequest } from "../utils/utils";
import { Order } from "../types/Order";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { Filters } from "./Filters";
import { IconButton } from "@mui/joy";
import { Category } from "../types/Category";
import { ArrowDown, Filter, Search } from "react-feather";

export default function ReportTable({
  items,
  setPlannedAmount,
  type,
}: {
  items: Expense[] | Income[];
  setPlannedAmount: Function;
  type: string;
}) {
  const [currency, setCurrency] = useState("pound");
  const [order, setOrder] = React.useState<Order>("desc");
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setError] = useState(false);

  useEffect(() => {
    serverRequest(
      "get",
      `finance/categories`,
      undefined,
      (data: Category[]) => {
        setCategories(data);
      },
      setError
    );
  }, []);

  return (
    <Box>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          my: 1,
          gap: 1,
        }}
      >
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <Filter />
        </IconButton>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: {
            xs: "none",
            sm: "flex",
          },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {
              xs: "120px",
              md: "160px",
            },
          },
        }}
      >
        <Filters addRow={undefined} categories={categories} />
      </Box>
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
            {stableSort(items, getComparator(order, "id")).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: "center" }}>{row.category.title}</td>
                <td>
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    variant="plain"
                    value={row.planned_amount}
                    onChange={(e) => setPlannedAmount(row.id, e.target.value)}
                    required
                    startDecorator={{ pound: "£" }[currency]}
                  />
                </td>
                <td>£{row.actual_amount}</td>
                <td style={{ textAlign: "right", paddingRight: "50px" }}>
                  £{Number(row.planned_amount) - Number(row.actual_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
