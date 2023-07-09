/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { getCookie } from "../utils/cookie";

type Props = {};

export default function SpreadSheets({}: Props) {
  const [error, setError] = useState(false);
  const [periods, setPeriods] = useState<
    [
      {
        id: number;
        title: string;
        total_spend: number;
        total_income: number;
      }
    ]
  >();

  async function getData() {
    const token = getCookie("token");
    try {
      await axios
        .get("http://127.0.0.1:8000/finance/spreadsheets", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => {
          setPeriods(res.data);
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
    <div className="p-4 sm:ml-64 pl-8 flex flex-col min-h-screen">
      <h1 className="mt-20 text-4xl text-black text-bold mb-4">2023</h1>
      <div className="flex flex-wrap gap-4 items-center space-between">
        {periods &&
          periods.map((period) => (
            <div
              className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700"
              key={period.id}
            >
              <Link
                to={`/spreadsheets/${period.id}`}
                className="flex justify-between items-center"
              >
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  {period.title}
                </h5>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  width="20"
                  fill="black"
                  viewBox="0 0 448 512"
                >
                  <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
              </Link>
              <div className="flex gap-x-10 justify-between">
                <div className="inline-flex items-center text-green-600 hover:underline">
                  Income : + {period.total_income}
                </div>
                <div className="inline-flex items-center text-red-600 hover:underline">
                  Expenses: - {period.total_spend}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
