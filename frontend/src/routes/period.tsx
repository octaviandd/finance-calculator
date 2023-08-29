/** @format */

import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Sheet,
  Typography,
} from "@mui/joy";
import { Plus } from "react-feather";
import CategoryTable from "../components/tables/CategoryTable";
import { MonthlyPeriod } from "../types/MonthlyPeriod";
import { serverRequest, debounce } from "../utils/utils";
import { Store } from "../Store";
import { Category } from "../types/Category";
import AmountSelector from "../components/inputs/Number";
import ReportDisplay from "../components/layout/ReportDisplay";

export default function Period() {
  const [error, setError] = useState(false);
  const { periodId } = useParams();
  const { state } = useLocation();
  const [period, setPeriod] = useState<MonthlyPeriod>();
  const { currency } = useContext(Store);

  const addCategory = (category: Category, categoryType: string) => {
    let key = `${categoryType}_categories` as keyof MonthlyPeriod;
    setPeriod(
      (prevState) =>
        prevState && { ...prevState, [key]: [...prevState[key], category] }
    );
  };

  const getMonthlyPeriod = (): void => {
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

  const debouncedHandleStartBalanceChange = debounce((value: string) => {
    setPeriod(
      (prevState) =>
        prevState && { ...prevState, start_balance: parseFloat(value) }
    );

    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/update-starting-balance`,
      { amount: parseFloat(value) },
      (data: string) => console.log(data),
      setError
    );
  }, 500);

  const debouncedHandleCategoryPlannedAmount = debounce(
    (id: string, value: string, categoryType: string): void => {
      let key = `${categoryType}_categories` as keyof MonthlyPeriod;
      setPeriod(
        (prevState) =>
          prevState && {
            ...prevState,
            [key]: [
              ...prevState[key].map((item: Category) =>
                item.id === id
                  ? { ...item, planned_amount: Number(value) }
                  : item
              ),
            ],
          }
      );

      serverRequest(
        "post",
        `finance/category/${id}/update-planned-amount`,
        { amount: parseFloat(value) },
        (data: string) => console.log(data),
        setError
      );
    },
    500
  );

  const debouncedSaveCategory = debounce(
    (categoryType: "income" | "expense", category: Category): void => {
      let key = `${categoryType}_categories` as keyof MonthlyPeriod;
      serverRequest(
        "post",
        `finance/monthly-period/${periodId}/create-category`,
        { categoryType, category },
        (data: Category) => {
          setPeriod(
            (prevState) =>
              prevState && { ...prevState, [key]: [...prevState[key], data] }
          );
        },
        setError
      );
    },
    500
  );

  const removeCategory = (
    categoryType: "income" | "expense",
    categoryId: string
  ): void => {
    let key = `${categoryType}_categories` as keyof MonthlyPeriod;
    serverRequest(
      "delete",
      `finance/monthly-period/${periodId}/delete-category`,
      { categoryId, categoryType },
      (data: Category[]) =>
        setPeriod(
          (prevState) =>
            prevState && {
              ...prevState,
              [key]: prevState[key].filter(
                (item: Category) => item.id !== categoryId
              ),
            }
        ),
      setError
    );
  };

  useEffect(() => {
    getMonthlyPeriod();
  }, []);

  useEffect(() => {
    setPeriod((prevState) => {
      if (prevState) {
        return {
          ...prevState,
          incomes: prevState.incomes.map((income) => ({
            ...income,
            amount: parseFloat((income.amount * currency.rate).toFixed(2)),
            category: {
              ...income.category,
              actual_amount: parseFloat(
                (income.category.actual_amount * currency.rate).toFixed(2)
              ),
              planned_amount: parseFloat(
                (income.category.planned_amount * currency.rate).toFixed(2)
              ),
            },
          })),
          income_categories: prevState.income_categories.map((income) => ({
            ...income,
            planned_amount: parseFloat(
              (income.planned_amount * currency.rate).toFixed(2)
            ),
            actual_amount: parseFloat(
              (income.actual_amount * currency.rate).toFixed(2)
            ),
          })),
          expenses: prevState.expenses.map((expense) => ({
            ...expense,
            amount: parseFloat((expense.amount * currency.rate).toFixed(2)),
            category: {
              ...expense.category,
              actual_amount: parseFloat(
                (expense.category.actual_amount * currency.rate).toFixed(2)
              ),
              planned_amount: parseFloat(
                (expense.category.planned_amount * currency.rate).toFixed(2)
              ),
            },
          })),
          expense_categories: prevState.expense_categories.map((expense) => ({
            ...expense,
            planned_amount: parseFloat(
              (expense.planned_amount * currency.rate).toFixed(2)
            ),
            actual_amount: parseFloat(
              (expense.actual_amount * currency.rate).toFixed(2)
            ),
          })),
          start_balance: parseFloat(
            (prevState.start_balance * currency.rate).toFixed(2)
          ),
        };
      }
    });
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography level="h1" fontSize="xl3" sx={{ mb: 1 }}>
            {period?.title}'s report
          </Typography>
          <FormControl size="sm">
            <FormLabel>Start balance:</FormLabel>
            {period && (
              <Box sx={{ display: "flex" }}>
                <AmountSelector
                  slotProps={{ input: { step: 1 } }}
                  currency={currency}
                  placeholder="999.99"
                  onChange={debouncedHandleStartBalanceChange}
                  amount={period.start_balance.toString()}
                  variant="plain"
                  id="amount"
                  name="amount"
                  required={true}
                />
                <Button
                  variant="plain"
                  sx={{ margin: 0, marginLeft: "6px" }}
                  type="submit"
                >
                  End balance from previous month
                </Button>
              </Box>
            )}
          </FormControl>
        </Box>
        <Link to={`/monthly-period/${periodId}/edit`}>
          <Button variant="solid">
            <Typography fontSize="md" sx={{ mx: 1, color: "white" }}>
              Edit transactions
            </Typography>
            <Plus size={16} />
          </Button>
        </Link>
      </Box>

      {period && (
        <ReportDisplay period={period} totalSaved={state.totalSaved} />
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "10px",
        }}
      >
        <Box>
          <Typography fontSize="xl2" sx={{ marginBottom: 4 }}>
            Expenses
          </Typography>
          <CategoryTable
            items={period?.expense_categories as Category[]}
            setPlannedAmount={(id: string, value: string) =>
              debouncedHandleCategoryPlannedAmount(id, value, "expense")
            }
            createRow={(item: Category, type: string) =>
              addCategory(item, type)
            }
            saveItem={(data: Category) =>
              debouncedSaveCategory("expense", data)
            }
            removeItem={(id: string) => removeCategory("expense", id)}
            type="expense"
          ></CategoryTable>
        </Box>
        <Box>
          <Typography fontSize="xl2" sx={{ marginBottom: 4 }}>
            Incomes
          </Typography>
          <CategoryTable
            items={period?.income_categories as Category[]}
            setPlannedAmount={(id: string, value: string) =>
              debouncedHandleCategoryPlannedAmount(id, value, "income")
            }
            createRow={(item: Category, type: string) =>
              addCategory(item, type)
            }
            saveItem={(data: Category) => debouncedSaveCategory("income", data)}
            removeItem={(id: string) => removeCategory("income", id)}
            type="income"
          ></CategoryTable>
        </Box>
      </Box>
    </Sheet>
  );
}
