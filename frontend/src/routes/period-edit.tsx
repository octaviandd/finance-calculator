/** @format */

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import Table from "../components/tables/Table";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { serverRequest } from "../utils/utils";
import { ArrowLeft } from "react-feather";
import { MonthlyPeriod } from "../types/MonthlyPeriod";
import { Store } from "../Store";

export default function PeriodEdit() {
  const [error, setError] = useState(false);
  const { periodId } = useParams();
  const [period, setPeriod] = useState<MonthlyPeriod>();
  const { currency } = useContext(Store);
  const navigate = useNavigate();

  const getMonthlyPeriod = async () => {
    serverRequest(
      "get",
      `finance/monthly-period/${periodId}`,
      undefined,
      (data: MonthlyPeriod) => {
        console.log(data);
        setPeriod(data);
      },
      setError
    );
  };

  const createRow = (
    item: Income | Expense,
    itemType: "incomes" | "expenses"
  ) => {
    setPeriod(
      (prevState) =>
        prevState && {
          ...prevState,
          [itemType]: [...prevState[itemType], item],
        }
    );
  };

  const saveItem = (
    data: Expense | Income,
    itemType: "expenses" | "incomes"
  ) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-${itemType}`,
      data,
      (item: Expense | Income) => {
        setPeriod(
          (prevState) =>
            prevState && {
              ...prevState,
              [itemType]: prevState[itemType]
                .concat(item)
                .filter((item) => item.status !== "new"),
            }
        );
      },
      setError
    );
  };

  const deleteItem = (itemId: string, itemType: "expenses" | "incomes") => {
    serverRequest(
      "delete",
      `finance/monthly-period/${periodId}/delete-${itemType}`,
      itemId,
      () =>
        setPeriod(
          (prevState) =>
            prevState && {
              ...prevState,
              [itemType]: prevState[itemType].filter(
                (item: Expense | Income) => item.id !== itemId
              ),
            }
        ),
      setError
    );
  };

  useEffect(() => {
    getMonthlyPeriod();
  }, [currency]);

  return (
    <Sheet
      sx={{
        bgcolor: "background.body",
        flex: 1,
        maxWidth: 1200,
        width: "100%",
        mx: "auto",
      }}
    >
      <div className="grid grid-col-auto">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            gap: 1,
          }}
        >
          <Button variant="soft" onClick={() => navigate(-1)} color="neutral">
            <ArrowLeft size={18}></ArrowLeft>
            <Typography sx={{ marginLeft: 1 }}>Back</Typography>
          </Button>
        </Box>

        <div className="mb-1">
          <Typography fontSize="xl2" sx={{ marginBottom: 2 }}>
            Expenses
          </Typography>
          {period && (
            <Table
              createRow={(item: Income) => createRow(item, "expenses")}
              items={period.expenses}
              categories={period.expense_categories}
              saveItem={(data: Expense) => saveItem(data, "expenses")}
              removeItem={(id: string) => deleteItem(id, "expenses")}
            />
          )}
        </div>
        <div className="w-full mt-12">
          <Typography fontSize="xl2" sx={{ marginBottom: 2 }}>
            Income
          </Typography>
          {period && (
            <Table
              createRow={(item: Income) => createRow(item, "incomes")}
              items={period.incomes}
              categories={period.income_categories}
              saveItem={(data: Expense) => saveItem(data, "incomes")}
              removeItem={(id: string) => deleteItem(id, "incomes")}
            />
          )}
        </div>
      </div>
    </Sheet>
  );
}
