/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { getCookie } from "../utils/cookie";
import PeriodContainer from "../utils/PeriodContainer";
import { Box } from "@mui/joy";

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
    <div className="flex flex-wrap gap-4 items-center space-between">
      {periods && periods.map((period) => <PeriodContainer period={period} />)}
    </div>
  );
}
