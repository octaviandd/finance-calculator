/** @format */

import React, { useContext, useState } from "react";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { Order } from "../../types/Order";
import { ArrowDown } from "react-feather";
import { Store } from "../../Store";
import { Category } from "../../types/Category";
import { Filters } from "../Filters";
import { Button } from "@mui/joy";
import TextSelector from "../inputs/Text";
import AmountSelector from "../inputs/Number";

export default function ReportTable({
  items,
  setPlannedAmount,
  createRow,
  saveItem,
  removeItem,
  type,
}: {
  items: Category[];
  setPlannedAmount: Function;
  createRow: Function;
  saveItem: Function;
  removeItem: Function;
  type: string;
}) {
  const [order, setOrder] = React.useState<Order>("desc");
  const { currency } = useContext(Store);
  const [block, setBlock] = useState(false);

  const addRow = () => {
    if (!block) {
      let item = {
        id: String(Math.floor(Math.random() * 0.5)),
        planned_amount: 0,
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
                <th style={{ width: 160, padding: 12 }}>Diff</th>
                <th style={{ width: 160, padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items &&
                items.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <TextSelector input={row.title || ""} />
                    </td>
                    <td>
                      <AmountSelector
                        amount={row.planned_amount.toString()}
                        currency={currency}
                        slotProps={{
                          input: {
                            precision: 2,
                            step: 0.01,
                          },
                        }}
                        onChange={(value: string) =>
                          setPlannedAmount(row.id, value)
                        }
                        id="amount"
                        name="amount"
                        variant="plain"
                        required={true}
                      />
                    </td>
                    <td>{currency.symbol}0</td>
                    <td>£{(0).toFixed(2)}</td>
                    <td>
                      {row.status === "new" ? (
                        <Button
                          variant="plain"
                          sx={{ margin: 0 }}
                          type="submit"
                        >
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
    </Box>
  );
}
