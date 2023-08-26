/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import Table from "../components/tables/Table";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";
import { serverRequest } from "../utils/utils";
import { ArrowLeft } from "react-feather";
import { MonthlyPeriod } from "../types/MonthlyPeriod";

export default function PeriodEdit() {
  const [error, setError] = useState(false);
  const { periodId } = useParams();
  const [period, setPeriod] = useState<MonthlyPeriod>();
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
              createRow={(item: Income) =>
                setPeriod(
                  (prevState) =>
                    prevState && {
                      ...prevState,
                      expenses: [...prevState.expenses, item],
                    }
                )
              }
              type="expense"
              items={period.expenses}
              categories={period.expense_categories}
              saveItem={(data: Expense) =>
                serverRequest(
                  "post",
                  `finance/monthly-period/${periodId}/save-expense`,
                  data,
                  () =>
                    setPeriod(
                      (prevState) =>
                        prevState && {
                          ...prevState,
                          expenses: [...prevState.expenses, data],
                        }
                    ),
                  setError
                )
              }
              removeItem={(expenseId: String) =>
                serverRequest(
                  "post",
                  `finance/monthly-period/${periodId}/delete-expense`,
                  expenseId,
                  () =>
                    setPeriod(
                      (prevState) =>
                        prevState && {
                          ...prevState,
                          expenses: prevState.expenses.filter(
                            (expense) => expense.id === expenseId
                          ),
                        }
                    ),
                  setError
                )
              }
            />
          )}
        </div>
        <div className="w-full mt-12">
          <Typography fontSize="xl2" sx={{ marginBottom: 2 }}>
            Income
          </Typography>
          {period && (
            <Table
              createRow={(item: Income) =>
                setPeriod(
                  (prevState) =>
                    prevState && {
                      ...prevState,
                      incomes: [...prevState.incomes, item],
                    }
                )
              }
              type="income"
              items={period.incomes}
              categories={period.income_categories}
              saveItem={(data: Income) =>
                serverRequest(
                  "post",
                  `finance/monthly-period/${periodId}/save-income`,
                  data,
                  () =>
                    setPeriod(
                      (prevState) =>
                        prevState && {
                          ...prevState,
                          incomes: [...prevState.incomes, data],
                        }
                    ),
                  setError
                )
              }
              removeItem={(incomeId: String) =>
                serverRequest(
                  "post",
                  `finance/monthly-period/${periodId}/remove-income`,
                  incomeId,
                  () =>
                    setPeriod(
                      (prevState) =>
                        prevState && {
                          ...prevState,
                          incomes: prevState.incomes.filter(
                            (income) => income.id === incomeId
                          ),
                        }
                    ),
                  setError
                )
              }
            />
          )}
        </div>
      </div>
    </Sheet>
  );
}
