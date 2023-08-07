/** @format */

import React, { useState, useEffect } from "react";
import { Form, Link, useLoaderData, useParams } from "react-router-dom";
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
import ReportTable from "../components/ReportTable";
import { MonthlyPeriod } from "../types/MonthlyPeriod";
import { serverRequest } from "../utils/utils";

export default function Period() {
  const [error, setError] = useState(false);
  const { periodId } = useParams();
  const [currency, setCurrency] = useState("pound");
  const [period, setPeriod] = useState<MonthlyPeriod>();

  const getMonthlyPeriod = async () => {
    serverRequest(
      "get",
      `finance/monthly-period/${periodId}`,
      undefined,
      (data: MonthlyPeriod) => setPeriod(data),
      setError
    );
  };

  const handleStartBalanceChange = (value: string) => {
    if (period) {
      setPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            start_balance: parseFloat(value),
          };
        }
      });
    }
  };

  const handleExpensePlannedAmount = (id: string, value: string) => {
    if (period) {
      setPeriod((prevState) => {
        if (prevState) {
          let toModifyExpenseIndex = prevState.expenses.findIndex(
            (expense) => expense.id == id
          );
          let newExpenses = [...prevState.expenses];
          newExpenses[toModifyExpenseIndex].planned_amount = value;
          return { ...prevState, expenses: newExpenses };
        }
      });

      serverRequest(
        "post",
        `finance/expense/${id}/update-planned-amount`,
        { amount: parseFloat(value) },
        (data: string) => console.log(data),
        setError
      );
    }
  };

  const handleIncomePlannedAmount = (id: string, value: string) => {
    if (period) {
      setPeriod((prevState) => {
        if (prevState) {
          let toModifyIncomeIndex = prevState.incomes.findIndex(
            (income) => income.id == id
          );
          let newIncomes = [...prevState.incomes];
          newIncomes[toModifyIncomeIndex].planned_amount = value;
          return { ...prevState, incomes: newIncomes };
        }
      });

      serverRequest(
        "post",
        `finance/income/${id}/update-planned-amount`,
        { amount: parseFloat(value) },
        (data: string) => console.log(data),
        setError
      );
    }
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
                <Input
                  type="number"
                  placeholder="£999.99"
                  value={period?.start_balance}
                  startDecorator={
                    { pound: "£", dollar: "$", euro: "€" }[currency]
                  }
                  onChange={(event) =>
                    handleStartBalanceChange(event.target.value)
                  }
                ></Input>
                <Button
                  variant="plain"
                  sx={{ margin: 0, marginLeft: "6px" }}
                  type="submit"
                  onClick={() => saveStartBalance()}
                >
                  Save
                </Button>
              </Box>
            )}
          </FormControl>
        </Box>
        <Link to={`/monthly-period/${periodId}/edit`}>
          <Button variant="solid">
            <Typography fontSize="md" sx={{ mx: 1, color: "white" }}>
              Add Transactions
            </Typography>
            <Plus size={16} />
          </Button>
        </Link>
      </Box>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={12}
        marginBottom="8rem"
        marginTop="8rem"
      >
        <div className="max-w-[400px] gap-x-4 flex items-center">
          <div>
            <div className="bg-[#334960] max-h-[400px] h-[200px] w-[70px] ml-auto"></div>
            <div className="font-medium">
              <p className="text-xl text-[#334960]">START BALANCE</p>
              <p className="text-right text-[#334960] italic">
                £{period?.start_balance && period.start_balance.toFixed(2)}
              </p>
            </div>
          </div>
          <div>
            <div className="bg-[#F46524] max-h-[400px] h-[200px] w-[70px] mr-auto"></div>
            <div className="font-medium">
              <p className="text-xl text-[#F46524]">END BALANCE</p>
              <p className="italic text-[#F46524]">
                £
                {period?.monthly_end_balance &&
                  period.monthly_end_balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="py-10 px-20 bg-[#ECEDEF]">
          <div className="border-b border-dashed border-neutral-400 pb-5">
            <p className="text-3xl text-center">£{0}</p>
            <p className="text-center">Increase in total savings</p>
          </div>
          <div className="pt-6">
            <p className="text-3xl text-center">
              {period?.monthly_saved_this_month &&
                period.monthly_saved_this_month.toFixed(2)}
            </p>
            <p className="text-center">Saved this month</p>
          </div>
        </div>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { sm: "1fr", lg: "1fr 1fr" },
          gap: "10px",
        }}
      >
        {period?.expenses && (
          <Box>
            <Typography fontSize="xl2">Expenses</Typography>
            <ReportTable
              items={period?.expenses}
              type="expenses"
              setPlannedAmount={handleExpensePlannedAmount}
            ></ReportTable>
          </Box>
        )}
        {period?.incomes && (
          <Box>
            <Typography fontSize="xl2">Incomes</Typography>
            <ReportTable
              items={period?.incomes}
              type="incomes"
              setPlannedAmount={handleIncomePlannedAmount}
            ></ReportTable>
          </Box>
        )}
      </Box>
    </Sheet>
  );
}
