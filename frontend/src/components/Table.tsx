/** @format */

import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
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

export default function OrderTable({
  createRow,
  type,
  items,
  saveItem,
}: {
  createRow: Function;
  type: String;
  items: Expense[] | Income[];
  saveItem: Function;
}) {
  const [currency, setCurrency] = useState("pound");
  const [categories, setCategories] = useState<Category[]>([]);
  const [order, setOrder] = useState<Order>("desc");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [open, setOpen] = useState(false);
  const [errors, setError] = useState(false);

  const addRow = () => {
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
  };

  const onSubmit = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const data = new FormData(form.currentTarget);
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
  }, [items]);

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
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Filters addRow={addRow} />
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
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
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for {type} source</FormLabel>
          <Input
            placeholder="Search"
            startDecorator={<i data-feather="search" />}
          />
        </FormControl>

        <Filters addRow={addRow} />
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
                <th style={{ width: 48, textAlign: "center", padding: 12 }}>
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length !== items.length
                    }
                    checked={selected.length === items.length}
                    onChange={(event) => {
                      setSelected(
                        event.target.checked
                          ? items.map((row) => row.title)
                          : []
                      );
                    }}
                    color={
                      selected.length > 0 || selected.length === items.length
                        ? "primary"
                        : undefined
                    }
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </th>
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
                <th style={{ width: 220, padding: 12 }}>To</th>
                <th style={{ width: 120, padding: 12 }}>Amount</th>
                <th style={{ width: 120, padding: 12 }}>Category</th>
                <th style={{ width: 160, padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stableSort(items, getComparator(order, "id")).map((row) => (
                <tr key={row.id}>
                  <td style={{ textAlign: "center" }}>
                    {/* <Checkbox
                    checked={selected.includes(items.id)}
                    color={selected.includes(items.id) ? "primary" : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(items.id)
                          : ids.filter((itemId) => itemId !== row.id)
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                    sx={{ verticalAlign: "text-bottom" }}
                  /> */}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Input id="title" name="title" />
                    ) : (
                      <Input id="title" name="title" disabled />
                    )}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Input type="date" id="date" name="date" />
                    ) : (
                      <Input type="date" id="date" name="date" disabled />
                    )}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Input type="text" id="text" name="text" />
                    ) : (
                      <Input type="text" id="text" name="text" disabled />
                    )}
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Input
                        type="number"
                        id="number"
                        name="number"
                        startDecorator={
                          { pound: "£", dollar: "$", euro: "€" }[currency]
                        }
                      />
                    ) : (
                      <Input
                        type="number"
                        id="number"
                        name="number"
                        disabled
                        startDecorator={
                          { pound: "£", dollar: "$", euro: "€" }[currency]
                        }
                      />
                    )}
                  </td>
                  <td>
                    <FormControl size="sm">
                      <Select placeholder="All">
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
                  </td>
                  <td>
                    {row.status === "new" ? (
                      <Button variant="plain" sx={{ margin: 0 }} type="submit">
                        Save
                      </Button>
                    ) : (
                      <>
                        <Link
                          fontWeight="lg"
                          component="button"
                          color="neutral"
                        >
                          Edit
                        </Link>
                        <Link
                          sx={{ ml: 2 }}
                          fontWeight="lg"
                          component="button"
                          color="neutral"
                        >
                          Archive
                        </Link>
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
