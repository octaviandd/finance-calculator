/** @format */

import React, { useState, useEffect } from "react";
import { Form, Link, useLoaderData, useParams } from "react-router-dom";
import { ContactInterface } from "../types/Contacts";
import axios, { AxiosError } from "axios";
import { getCookie } from "../utils/cookie";
import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { Plus } from "react-feather";
import ReportTable from "../utils/ReportTable";

interface SpreadSheet {
  title: string;
  expenses: [{ id: 0; title: string; amount: number; planned_amount: number }];
  incomes: [{ id: 0; title: string; amount: number; planned_amount: number }];
  total_income: number;
  total_saved_this_period: number;
  total_savings: number;
  total_spend: number;
  start_balance: number;
}

export default function Spreadsheets() {
  const [error, setError] = useState(false);
  const [toastState, setToastState] = useState(true);
  const [isModalOpen, setModalState] = useState(false);
  const { spreadsheetId } = useParams();
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet>({
    title: "",
    expenses: [{ id: 0, title: "", amount: 0, planned_amount: 0 }],
    incomes: [{ id: 0, title: "", amount: 0, planned_amount: 0 }],
    total_income: 0,
    total_saved_this_period: 0,
    total_savings: 0,
    total_spend: 0,
    start_balance: 0,
  });

  async function getData() {
    const token = getCookie("token");
    try {
      await axios
        .get(`http://127.0.0.1:8000/finance/spreadsheets/${spreadsheetId}`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => {
          setSpreadSheet((prevState) => ({
            ...prevState,
            title: res.data.title,
            expenses: res.data.expenses,
            incomes: res.data.incomes,
            total_income: res.data.total_income,
            total_saved_this_period: res.data.total_saved_this_period,
            total_savings: res.data.total_savings,
            total_spend: res.data.total_spend,
            start_balance: res.data.start_balance,
          }));
        });
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  }

  useEffect(() => {
    getData();
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
        <Typography level="h1" fontSize="xl3" sx={{ mb: 1 }}>
          {spreadSheet.title}'s report
        </Typography>
        <Link to={`/spreadsheets/${spreadsheetId}/edit`}>
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
                £{spreadSheet.start_balance}
              </p>
            </div>
          </div>
          <div>
            <div className="bg-[#F46524] max-h-[400px] h-[200px] w-[70px] mr-auto"></div>
            <div className="font-medium">
              <p className="text-xl text-[#F46524]">END BALANCE</p>
              <p className="italic text-[#F46524]">
                £
                {spreadSheet.start_balance +
                  spreadSheet.total_saved_this_period}
              </p>
            </div>
          </div>
        </div>
        <div className="py-10 px-20 bg-[#ECEDEF]">
          <div className="border-b border-dashed border-neutral-400 pb-5">
            <p className="text-3xl text-center">£{spreadSheet.total_savings}</p>
            <p className="text-center">Increase in total savings</p>
          </div>
          <div className="pt-6">
            <p className="text-3xl text-center">
              {spreadSheet.total_saved_this_period}
            </p>
            <p className="text-center">Saved this month</p>
          </div>
        </div>
      </Stack>

      <ReportTable></ReportTable>

      <ReportTable></ReportTable>

      {isModalOpen && (
        <div
          id="large-modal"
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] flex items-center justify-center max-h-full"
        >
          <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Large modal
                </h3>
                <button
                  onClick={() => setModalState(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="large-modal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  With less than a month to go before the European Union enacts
                  new consumer privacy laws for its citizens, companies around
                  the world are updating their terms of service agreements to
                  comply.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  The European Union’s General Data Protection Regulation
                  (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                  common set of data rights in the European Union. It requires
                  organizations to notify users as soon as possible of high-risk
                  data breaches that could personally affect them.
                </p>
              </div>
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="large-modal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
                <button
                  data-modal-hide="large-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
