/** @format */

import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
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
import { serverRequest } from "../utils/utils";
import { Store } from "../Store";
import { Category } from "../types/Category";
import AmountSelector from "../components/inputs/Number";
import ReportDisplay from "../components/layout/ReportDisplay";

export default function Period() {
  const [error, setError] = useState(false);
  const { periodId } = useParams();
  const [period, setPeriod] = useState<MonthlyPeriod>();
  const { currency } = useContext(Store);

  const addExpenseCategory = (category: Category) => {
    setPeriod((prevState) => {
      if (prevState) {
        let newExpenses = [...prevState.expense_categories, category];
        return { ...prevState, expense_categories: newExpenses };
      }
    });
  };
  const addIncomeCategory = (category: Category) => {
    setPeriod((prevState) => {
      if (prevState) {
        let newExpenses = [...prevState.income_categories, category];
        return { ...prevState, income_categories: newExpenses };
      }
    });
  };

  const createRow = (item: any, type: any) =>
    type === "expense" ? addExpenseCategory(item) : addIncomeCategory(item);

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

  const handleStartBalanceChange = (value: string) =>
    setPeriod(
      (prevState) =>
        prevState && { ...prevState, start_balance: parseFloat(value) }
    );

  const handleIncomeCategoryPlannedAmount = (id: string, value: string) => {
    if (period) {
      setPeriod((prevState) => {
        if (prevState) {
          let toModifyCategoryIndex = prevState.income_categories.findIndex(
            (category) => category.id == id
          );
          let newIncomes = [...prevState.income_categories];
          newIncomes[toModifyCategoryIndex].planned_amount = Number(value);
          return { ...prevState, income_categories: newIncomes };
        }
      });

      serverRequest(
        "post",
        `finance/category/${id}/update-planned-amount`,
        { amount: parseFloat(value) },
        (data: string) => console.log(data),
        setError
      );
    }
  };

  const handleExpenseCategoryPlannedAmount = (id: string, value: string) => {
    if (period) {
      setPeriod((prevState) => {
        if (prevState) {
          let toModifyCategoryIndex = prevState.expense_categories.findIndex(
            (category) => category.id == id
          );
          let newIncomes = [...prevState.expense_categories];
          newIncomes[toModifyCategoryIndex].planned_amount = Number(value);
          return { ...prevState, expense_categories: newIncomes };
        }
      });

      serverRequest(
        "post",
        `finance/category/${id}/update-planned-amount`,
        { amount: parseFloat(value) },
        (data: string) => console.log(data),
        setError
      );
    }
  };

  const saveCategory = async (
    categoryType: "income" | "expense",
    category: Category
  ) => {
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
  };

  const removeCategory = async (
    categoryType: "income" | "expense",
    categoryId: string
  ) => {
    console.log(categoryId, categoryType);
    let key = `${categoryType}_categories` as keyof MonthlyPeriod;
    serverRequest(
      "delete",
      `finance/monthly-period/${periodId}/delete-category`,
      categoryId,
      () =>
        setPeriod(
          (prevState) =>
            prevState && {
              ...prevState,
              [key]: prevState[key].filter(
                (item: Category) => item.id === categoryId
              ),
            }
        ),
      setError
    );
  };

  const saveStartBalance = () => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/update-starting-balance`,
      { start_balance: period?.start_balance },
      (data: number) => console.log(data),
      setError
    );
  };

  useEffect(() => {
    getMonthlyPeriod();
  }, []);

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
                  onChange={handleStartBalanceChange}
                  amount={period?.start_balance.toString()}
                  variant="plain"
                  id="amount"
                  name="amount"
                  required={true}
                />
                <Button
                  variant="plain"
                  sx={{ margin: 0, marginLeft: "6px" }}
                  type="submit"
                  onClick={() => saveStartBalance()}
                >
                  Save
                </Button>
                <Button
                  variant="plain"
                  sx={{ margin: 0, marginLeft: "6px" }}
                  type="submit"
                  onClick={() => saveStartBalance()}
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

      {period && <ReportDisplay currency={currency} period={period} />}

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
            setPlannedAmount={handleExpenseCategoryPlannedAmount}
            createRow={createRow}
            saveItem={(data: Category) => saveCategory("expense", data)}
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
            setPlannedAmount={handleIncomeCategoryPlannedAmount}
            createRow={createRow}
            saveItem={(data: Category) => saveCategory("income", data)}
            removeItem={(id: string) => removeCategory("income", id)}
            type="income"
          ></CategoryTable>
        </Box>
      </Box>
    </Sheet>
  );
}
