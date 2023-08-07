/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import Table from "../components/Table";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { serverRequest } from "../utils/utils";
import { MonthlyPeriod } from "../types/MonthlyPeriod";
import { ArrowLeft } from "react-feather";

export default function PeriodEdit() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState(false);
  const { periodId } = useParams();
  const navigate = useNavigate();

  const addExpense = (expense: Expense) => {
    setExpenses((prevState) => prevState.concat(expense));
  };

  const addIncome = (income: Income) => {
    setIncomes((prevState) => [...prevState, income]);
  };

  const createRow = (item: any, type: any) => {
    if (type === "expense") {
      addExpense(item);
    } else if (type === "income") {
      console.log("hit");
      addIncome(item);
    }
  };

  const saveExpense = async (expense: Expense) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-expense`,
      { type: expense, periodId },
      (data: Expense) => setExpenses((prevState) => [...prevState, data]),
      setError
    );
  };

  const saveIncome = async (income: Income) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-income`,
      { type: income, periodId },
      (data: Income) => setIncomes((prevState) => [...prevState, data]),
      setError
    );
  };

  const removeExpense = async (expenseId: string) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-income`,
      expenseId,
      (data: Expense) => setExpenses((prevState) => [...prevState, data]),
      setError
    );
  };

  const removeIncome = async (incomeId: string) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-income`,
      incomeId,
      (data: Income) => setIncomes((prevState) => [...prevState, data]),
      setError
    );
  };

  useEffect(() => {
    serverRequest(
      "get",
      `finance/monthly-period/${periodId}/edit`,
      undefined,
      (data: MonthlyPeriod) => {
        setExpenses(data.expenses);
        setIncomes(data.incomes);
      },
      setError
    );
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
      <div className="grid grid-col-auto">
        <Button
          sx={{ marginBottom: "16px", cursor: "pointer", marginRight: "auto" }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft></ArrowLeft>
        </Button>
        <div className="mb-1">
          <Typography fontSize="xl2">Expenses</Typography>
          <Table
            createRow={createRow}
            type="expense"
            items={expenses}
            saveItem={saveExpense}
            removeItem={removeExpense}
          />
        </div>
        <div className="w-full mt-12">
          <Typography fontSize="xl2">Income</Typography>
          <Table
            createRow={createRow}
            type="income"
            items={incomes}
            saveItem={saveIncome}
            removeItem={removeIncome}
          />
        </div>
      </div>
    </Sheet>
  );
}
