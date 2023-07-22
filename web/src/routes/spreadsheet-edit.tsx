/** @format */

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import Datepicker from "react-tailwindcss-datepicker";
import { Dropdown } from "flowbite-react";
import { v4 as uuidv4 } from "uuid";
import { Box, Sheet, Typography } from "@mui/joy";
import Table from "../utils/Table";

type Props = {};

type Category = {
  title: string;
  description: string;
};

type Expense = {
  id?: number;
  title: string;
  description: string;
  planned_amount: number;
  actual_amount: number;
  categories: Category;
};

type Income = {
  id?: number;
  title: string;
  description: string;
  planned_amount: number;
  actual_amount: number;
  categories: Category;
};

export default function SpreadsheetEdit({}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState(false);
  const { spreadsheetId } = useParams();
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const navigate = useNavigate();
  const token = getCookie("token");

  const handleValueChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  const addExpense = (expense: Expense) => {
    setExpenses((prevState) => prevState.concat(expense));
  };

  const addIncome = (income: Income) => {
    setIncomes((prevState) => [...prevState, income]);
  };

  const updateSpreadSheet = async (type: string) => {
    let url = type === "saving" ? "/finance/login" : "/finance/login";

    try {
      await axios
        .post(url, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  };

  async function getSpreadSheetData() {
    try {
      await axios
        .get(
          `http://127.0.0.1:8000/finance/spreadsheets/${spreadsheetId}/edit`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        )
        .then((res) => {
          setExpenses(res.data.expenses);
          setIncomes(res.data.incomes);
        });
    } catch (error) {
      let err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  }

  useEffect(() => {
    getSpreadSheetData();
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
          <Table />
        </div>
        <div className="w-full mt-12">
          <Typography fontSize="xl2">Income</Typography>
          <Table />
        </div>
      </div>
    </Sheet>
  );
}
