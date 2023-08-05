/** @format */

import Box from "@mui/joy/Box";
import Chip, { chipClasses } from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import Periods from "./Periods";
import { Button, TabPanel } from "@mui/joy";
import { useState, useEffect } from "react";
import { serverRequest } from "../utils/utils";
import { Period } from "../types/Period";

export default function MyProfile() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [errors, setErrors] = useState();

  useEffect(() => {
    serverRequest(
      "GET",
      `finance/yearly-periods`,
      undefined,
      (data: Period[]) => {
        setPeriods(data);
      },
      setErrors
    );
  }, []);

  const addNewPeriod = () => {
    if (periods) {
      serverRequest(
        "POST",
        `finance/yearly-period-create`,
        { previousYear: periods[periods.length - 1].title },
        (data: Period) => {
          setPeriods((prevState) => [...prevState, data]);
        },
        setErrors
      );
    }
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
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography level="h1" fontSize="xl2" sx={{ mb: 1 }}>
          Periods
        </Typography>
        <Button onClick={addNewPeriod}>Add a new period</Button>
      </Box>
      <Tabs
        defaultValue={1}
        sx={{
          bgcolor: "background.body",
          "--Tab-height": "48px",
        }}
      >
        <Box
          sx={{
            "--_shadow-height": "16px",
            height: 0,
            position: "sticky",
            top: "calc(var(--Tab-height) - var(--main-paddingTop, 0px) + var(--Header-height, 0px) - (var(--_shadow-height) / 2))",
            zIndex: 1,
            "&::before": {
              content: '""',
              display: "block",
              position: "relative",
              zIndex: 1,
              height: "var(--_shadow-height)",
              background:
                "radial-gradient(closest-side, rgba(0 0 0 / 0.12), transparent 100%)",
            },
          }}
        />
        <TabList
          variant="plain"
          size="sm"
          sx={(theme) => ({
            "--List-padding": "0px",
            "--ListItem-minHeight": "var(--Tab-height)",
            "--Chip-minHeight": "20px",
            "--_TabList-bg": theme.vars.palette.background.body,
            backgroundColor: "var(--_TabList-bg)",
            boxShadow: `inset 0 -1px 0 0 ${theme.vars.palette.divider}`,
            position: "sticky",
            top: "calc(-1 * (var(--main-paddingTop, 0px) - var(--Header-height, 0px)))",
            zIndex: 10,
            width: "100%",
            overflow: "auto hidden",
            alignSelf: "flex-start",
            borderRadius: 0,
            scrollSnapType: "inline",
            "&::after": {
              pointerEvents: "none",
              display: { xs: "block", sm: "none" },
              content: '""',
              position: "sticky",
              top: 0,
              width: 40,
              flex: "none",
              zIndex: 1,
              right: 0,
              borderBottom: "1px solid transparent",
              background: `linear-gradient(to left, var(--_TabList-bg), rgb(0 0 0 / 0))`,
              backgroundClip: "content-box",
            },
            "&::-webkit-scrollbar": {
              width: 0,
              display: "none",
            },
            [`& .${tabClasses.root}`]: {
              "&:first-of-type": {
                ml: "calc(-1 * var(--ListItem-paddingX))",
              },
              scrollSnapAlign: "start",
              bgcolor: "transparent",
              boxShadow: "none",
              flex: "none",
              "&:hover": {
                bgcolor: "transparent",
              },
              [`&.${tabClasses.selected}`]: {
                color: "primary.plainColor",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  zIndex: 1,
                  bottom: 0,
                  left: "var(--ListItem-paddingLeft)",
                  right: "var(--ListItem-paddingRight)",
                  height: "2px",
                  bgcolor: "primary.500",
                },
                [`& .${chipClasses.root}`]: theme.variants.solid.primary,
              },
            },
          })}
        >
          {periods?.map((period, index) => (
            <Tab value={index + 1} key={period.id}>
              {period.title}
            </Tab>
          ))}
        </TabList>
        {periods?.map((period, index) => (
          <TabPanel value={index + 1} sx={{ p: 2 }} key={period.id}>
            <Periods period={period}></Periods>
          </TabPanel>
        ))}
      </Tabs>
    </Sheet>
  );
}
