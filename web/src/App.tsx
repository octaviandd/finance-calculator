/** @format */

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import customTheme from "./theme";
import Sidebar from "./utils/Sidebar";
import Header from "./utils/Header";
import Profile from "./utils/Profile";
import { Outlet } from "react-router-dom";

export default function JoyOrderDashboardTemplate() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <GlobalStyles
        styles={{
          "[data-feather], .feather": {
            color: "var(--Icon-color)",
            margin: "var(--Icon-margin)",
            fontSize: "var(--Icon-fontSize, 20px)",
            width: "1em",
            height: "1em",
          },
        }}
      />
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={(theme) => ({
            "--main-paddingTop": {
              xs: `calc(${theme.spacing(2)} + var(--Header-height, 0px))`,
              md: "32px",
            },
            px: {
              xs: 2,
              md: 3,
            },
            pt: "var(--main-paddingTop)",
            pb: {
              xs: 2,
              sm: 2,
              md: 3,
            },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
            overflow: "auto",
          })}
        >
          <Outlet></Outlet>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
