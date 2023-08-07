/** @format */

import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import { Filter, PlusCircle } from "react-feather";
import { Category } from "../types/Category";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { Order } from "../types/Order";
import { Filters } from "./Filters";

import {
  stableSort,
  getComparator,
  formatDate,
  serverRequest,
} from "../utils/utils";
import dayjs from "dayjs";
import { Store } from "../Store";

export default function OrderTable({
  createRow,
  type,
  items,
  saveItem,
  removeItem,
}: {
  createRow: Function;
  type: String;
  items: Expense[] | Income[];
  saveItem: Function;
  removeItem: Function;
}) {
  const [block, setBlock] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [order, setOrder] = useState<Order>("desc");
  const [open, setOpen] = useState(false);
  const [errors, setError] = useState(false);
  const { currency } = useContext(Store);

  const addRow = () => {
    if (!block) {
      let formattedDate = formatDate(new Date());
      let item = {
        id: String(Math.floor(Math.random() * 0.5)),
        title: "",
        date: formattedDate,
        target: "",
        category: "",
        planned_amount: "",
        status: "new",
      };
      createRow(item, type);
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
    <>
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
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<i data-feather="search" />}
          sx={{ flexGrow: 1 }}
        />
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
        {/* <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for {type}</FormLabel>
          <Input
            placeholder="Search"
            startDecorator={<i data-feather="search" />}
          />
        </FormControl> */}

        <Filters addRow={addRow} categories={categories} />
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
              {stableSort(items, getComparator(order, "id")).map((row) => (
                <tr key={row.id}>
                  <td>
                    {row.status === "new" ? (
                      <Input id="title" name="title" required />
                    ) : (
                      <Input id="title" name="title" value={row.title} />
                    )}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Input type="date" id="date" name="date" required />
                    ) : (
                      <Input
                        type="date"
                        id="date"
                        name="date"
                        value={dayjs(row.date).format("YYYY-MM-DD")}
                      />
                    )}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Input
                        type="number"
                        id="amount"
                        name="amount"
                        required
                        startDecorator={
                          {
                            pound: currency.symbol,
                            dollar: currency.symbol,
                            euro: currency.symbol,
                          }[currency.title]
                        }
                      />
                    ) : (
                      <Input
                        type="number"
                        id="amount"
                        name="amount"
                        value={row.actual_amount}
                        startDecorator={
                          {
                            pound: currency.symbol,
                            dollar: currency.symbol,
                            euro: currency.symbol,
                          }[currency.title]
                        }
                      />
                    )}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <FormControl size="sm">
                        <Select placeholder="All" id="category" name="category">
                          {categories.map((category) => (
                            <Option key={category.id} value={category.id}>
                              {category.title}
                            </Option>
                          ))}
                          <Option
                            value="add"
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyItems: "center",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            <PlusCircle
                              size="16"
                              className="text-center"
                            ></PlusCircle>
                          </Option>
                        </Select>
                      </FormControl>
                    ) : (
                      <FormControl size="sm">
                        <Select placeholder="All" id="category" name="category">
                          {categories.map((category) => (
                            <Option key={category.id} value={category.id}>
                              {category.title}
                            </Option>
                          ))}
                          <Option
                            value="add"
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyItems: "center",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            <PlusCircle
                              size="16"
                              className="text-center"
                            ></PlusCircle>
                          </Option>
                        </Select>
                      </FormControl>
                    )}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Button variant="plain" sx={{ margin: 0 }} type="submit">
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          sx={{ ml: 2 }}
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
      </Sheet>
    </>
  );
}
