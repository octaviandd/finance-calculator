/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import Table from "../components/Table";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { serverRequest } from "../utils/utils";
import { MonthlyPeriod } from "../types/MonthlyPeriod";
import { ArrowLeft, PlusCircle } from "react-feather";
import CategoryModal from "../components/CategoryModal";
import { Category } from "../types/Category";

export default function PeriodEdit() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const { periodId } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const addExpense = (expense: Expense) =>
    setExpenses((prevState) => prevState.concat(expense));
  const addIncome = (income: Income) =>
    setIncomes((prevState) => [...prevState, income]);

  const createRow = (item: any, type: any) => {
    if (type === "expense") addExpense(item);
    else if (type === "income") addIncome(item);
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

  const createCategory = (title: string) => {
    serverRequest(
      "post",
      `finance/create-category`,
      { title },
      (data: Category[]) => {
        setCategories(data);
      },
      setError
    );
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
    <Sheet
      sx={{
        bgcolor: "background.body",
        flex: 1,
        maxWidth: 1200,
        width: "100%",
        mx: "auto",
      }}
    >
      <CategoryModal
        createCategory={createCategory as Function}
        categories={categories}
        open={open}
        setOpen={setOpen}
      ></CategoryModal>
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
          <Button
            variant="solid"
            sx={{ marginTop: "auto" }}
            onClick={() => setOpen(true)}
          >
            <Typography
              level="title-sm"
              sx={{ marginRight: 1, color: "white" }}
            >
              Create Category
            </Typography>
            <PlusCircle></PlusCircle>
          </Button>
        </Box>

        <div className="mb-1">
          <Typography fontSize="xl2" sx={{ marginBottom: 2 }}>
            Expenses
          </Typography>
          {expenses.length > 1 && categories.length > 1}
          <Table
            createRow={createRow}
            type="expense"
            items={expenses}
            categories={categories}
            saveItem={saveExpense}
            removeItem={removeExpense}
          />
        </div>
        <div className="w-full mt-12">
          <Typography fontSize="xl2" sx={{ marginBottom: 2 }}>
            Income
          </Typography>
          {incomes.length > 1 && categories.length > 1}
          <Table
            createRow={createRow}
            type="income"
            items={incomes}
            categories={categories}
            saveItem={saveIncome}
            removeItem={removeIncome}
          />
        </div>
      </div>
    </Sheet>
  );
}
