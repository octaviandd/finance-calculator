/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import Table from "../components/tables/Table";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { serverRequest } from "../utils/utils";
import { ArrowLeft, PlusCircle } from "react-feather";
import { Category } from "../types/Category";

export default function PeriodEdit() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState(false);
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

  const modifyItem = async (
    itemId: string,
    endpoint: string,
    data: Income | Expense,
    setFunction: Function,
    setErrorFunction: Function,
    requestType: string
  ) => {
    serverRequest(
      requestType,
      `finance/monthly-period/${periodId}/${endpoint}`,
      itemId,
      (data: Income | Expense) =>
        setFunction((prevState: Income[] | Expense[]) => [...prevState, data]),
      setError
    );
  };

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
          <Table
            createRow={createRow}
            type="expense"
            items={expenses}
            categories={categories}
            saveItem={modifyItem}
            removeItem={modifyItem}
          />
        </div>
        <div className="w-full mt-12">
          <Typography fontSize="xl2" sx={{ marginBottom: 2 }}>
            Income
          </Typography>
          <Table
            createRow={createRow}
            type="income"
            items={incomes}
            categories={categories}
            saveItem={(data: Income) =>
              serverRequest(
                "post",
                `finance/monthly-period/${periodId}/save-income`,
                data.category,
                () => setIncomes((prevState) => [...prevState, data]),
                setError
              )
            }
            removeItem={(incomeId: String) =>
              serverRequest(
                "post",
                `finance/monthly-period/${periodId}/remove-income`,
                incomeId,
                () => setIncomes((prevState) => [...prevState]),
                setError
              )
            }
          />
        </div>
      </div>
    </Sheet>
  );
}
