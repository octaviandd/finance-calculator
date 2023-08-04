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

export default function BasicCard({ period }: { period: MonthlyPeriod }) {
  return (
    <Card variant="outlined" sx={{ width: 370 }}>
      <div>
        <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
          {period.title}
        </Typography>
        <Typography level="body2">
          {dayjs(period.from_date).format("MMMM DD")} to{" "}
          {dayjs(period.to_date).format("MMMM DD")},{" "}
          {dayjs(period.to_date).format("YYYY")}
        </Typography>
      </div>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body3">Income:</Typography>
          <Typography fontSize="lg" fontWeight="lg" color="success">
            £{period.total_income}
          </Typography>
        </div>
        <div>
          <Typography level="body3">Expenses:</Typography>
          <Typography fontSize="lg" fontWeight="lg" color="danger">
            £{period.total_spend}
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
