/** @format */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Sheet, Typography } from "@mui/joy";
import Table from "../components/Table";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { serverRequest } from "../utils/utils";
import { MonthlyPeriod } from "../types/MonthlyPeriod";

export default function PeriodEdit() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState(false);
  const { periodId } = useParams();

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
      addIncome(item);
    }
  };

  const saveExpense = async (expense: Expense) => {
    serverRequest(
      "post",
      `finance/monthly-period/${periodId}/save-expense`,
      expense,
      setExpenses,
      setError
    );
  };

  const saveIncome = async (income: Income) => {
    serverRequest(
      "post",
      `finance/montly-period/${periodId}/save-income`,
      income,
      setIncomes,
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
        <div className="mb-1">
          <Typography fontSize="xl2">Expenses</Typography>
          <Table
            createRow={createRow}
            type="expense"
            items={expenses}
            saveItem={saveExpense}
          />
        </div>
        <div className="w-full mt-12">
          <Typography fontSize="xl2">Income</Typography>
          <Table
            createRow={createRow}
            type="income"
            items={incomes}
            saveItem={saveIncome}
          />
        </div>
      </div>
    </Sheet>
  );
}
