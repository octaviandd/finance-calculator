/** @format */

import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Plus } from "react-feather";
import CategoryTable from "../components/tables/CategoryTable";
import { MonthlyPeriod } from "../types/MonthlyPeriod";
import { serverRequest } from "../utils/utils";
import { Store } from "../Store";
import { Category } from "../types/Category";
import AmountSelector from "../components/inputs/AmountSelector";
import ReportDisplay from "../components/layout/ReportDisplay";

export default function Period() {
  const [error, setError] = useState(false);
  const { periodId } = useParams();
  const [period, setPeriod] = useState<MonthlyPeriod>();
  const { currency } = useContext(Store);
  const [expensesCategories, setExpensesCategories] = useState<Category[]>([]);
  const [incomesCategories, setIncomesCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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

  const saveIncomeCategory = async (category: Category) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-income`,
      { type: category, periodId },
      (data: Category) =>
        setPeriod(
          (prevState) =>
            prevState && {
              ...prevState,
              income_categories: [...prevState.income_categories, data],
            }
        ),
      setError
    );
  };

  const saveExpenseCategory = async (category: Category) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-expense`,
      { type: category, periodId },
      (data: Category) =>
        setPeriod((prevState) => {
          if (prevState) {
            let newExpenses = [...prevState.expense_categories, data];
            return { ...prevState, expense_categories: newExpenses };
          }
        }),
      setError
    );
  };

  const removeExpenseCategory = async (expenseId: string) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-income`,
      expenseId,
      (data: Category) =>
        setExpensesCategories((prevState) => [...prevState, data]),
      setError
    );
  };

  const removeIncomeCategory = async (incomeId: string) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-income`,
      incomeId,
      (data: Category) =>
        setIncomesCategories((prevState) => [...prevState, data]),
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

  const getCategories = (title: string) => {
    serverRequest(
      "post",
      `finance/categories`,
      { title },
      (data: Category[]) => {
        setCategories(data);
      },
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
                  amount={period?.start_balance}
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
            saveItem={saveExpenseCategory}
            removeItem={removeExpenseCategory}
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
            saveItem={saveIncomeCategory}
            removeItem={removeIncomeCategory}
            type="income"
          ></CategoryTable>
        </Box>
      </Box>
    </Sheet>
  );
}
