/** @format */

import React, { useState, useContext } from "react";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { formatDate } from "../../utils/utils";
import { Category } from "../../types/Category";
import { Expense } from "../../types/Expense";
import { Income } from "../../types/Income";
import { Order } from "../../types/Order";
import { Filters } from "../Filters";
import CategorySelector from "../inputs/Select";
import AmountSelector from "../inputs/Number";
import DateSelector from "../inputs/Date";
import TextSelector from "../inputs/Text";
import { v4 as uuidv4 } from "uuid";

export default function OrderTable({
  createRow,
  items,
  categories,
  saveItem,
  removeItem,
}: {
  createRow: Function;
  items: Expense[] | Income[];
  categories: Category[];
  saveItem: Function;
  removeItem: Function;
}) {
  const [block, setBlock] = useState(false);
  const [order, setOrder] = useState<Order>("desc");

  const addRow = () => {
    if (!block) {
      let formattedDate = formatDate(new Date());
      let item = {
        title: "",
        date: formattedDate,
        target: "",
        category: "",
        planned_amount: "",
        status: "new",
      };
      createRow(item);
      setBlock(true);
    }
  };

  const onSubmit = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    saveItem(formJson);
    form.currentTarget.reset();
    setBlock(false);
  };

  return (
    <>
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
        <form onSubmit={onSubmit}>
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
                <th style={{ width: 140, padding: 12 }}>
                  <Link
                    underline="none"
                    color="primary"
                    component="button"
                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                    fontWeight="lg"
                    endDecorator={<i data-feather="arrow-down" />}
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
                <th style={{ width: 120, padding: 12 }}>Date</th>
                <th style={{ width: 120, padding: 12 }}>Amount</th>
                <th style={{ width: 120, padding: 12 }}>Category</th>
                <th style={{ width: 160, padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={uuidv4()}>
                  <td>
                    <TextSelector input={row.title || ""} />
                  </td>
                  <td>
                    <DateSelector row={row} />
                  </td>
                  <td>
                    <AmountSelector
                      amount={row.amount ? row.amount.toString() : "0"}
                      variant="plain"
                      id="amount"
                      name="amount"
                      required={true}
                    />
                  </td>
                  <td>
                    <CategorySelector
                      categories={categories}
                      categoryId={row?.category?.id}
                    />
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Button variant="plain" sx={{ margin: 0 }} type="submit">
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="plain"
                          color="danger"
                          onClick={() => removeItem(row.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </form>
        <Filters addRow={addRow} />
      </Sheet>
    </>
  );
}
