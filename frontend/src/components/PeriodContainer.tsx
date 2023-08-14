/** @format */

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Link } from "react-router-dom";
import { Maximize } from "react-feather";
import { Box } from "@mui/joy";
import { MonthlyPeriod } from "../types/MonthlyPeriod";
import dayjs from "dayjs";
import { Store } from "../Store";
import { useContext } from "react";

export default function BasicCard({ period }: { period: MonthlyPeriod }) {
  const { currency } = useContext(Store);
  return (
    <Card variant="outlined" sx={{ width: 370 }}>
      <div>
        <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
          {period.title}
        </Typography>
        <Typography level="body-sm">
          {dayjs(period.from_date).format("MMMM DD")} to{" "}
          {dayjs(period.to_date).format("MMMM DD")},{" "}
          {dayjs(period.to_date).format("YYYY")}
        </Typography>
      </div>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-sm">Income:</Typography>
          <Typography fontSize="lg" fontWeight="lg" color="success">
            {currency.symbol}
            {(
              period.monthly_total_actual_incomes_amount * currency.rate
            ).toFixed(2)}
          </Typography>
        </div>
        <div>
          <Typography level="body-sm">Expenses:</Typography>
          <Typography fontSize="lg" fontWeight="lg" color="danger">
            {currency.symbol}
            {(
              period.monthly_total_actual_expenses_amount * currency.rate
            ).toFixed(2)}
          </Typography>
        </div>

        <Box
          sx={{
            alignSelf: "flex-end",
            marginLeft: "auto",
          }}
        >
          <Link to={`/monthly-period/${period.id}`}>
            <Button
              variant="solid"
              size="sm"
              color="primary"
              sx={{ ml: "auto", fontWeight: 600 }}
            >
              <Maximize size={18} />
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
