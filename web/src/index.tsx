/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/public-sans";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error";
import Spreadsheet from "./routes/spreadsheet";
import Spreadsheets from "./routes/spreadsheets";
import EditContact from "./routes/edit";
import LoginPage from "./routes/login";
import RegisterPage from "./routes/register";
import Dashboard from "./routes/dashboard";
import Root from "./routes/root";
import SpreadsheetEdit from "./routes/spreadsheet-edit";
import Profile from "./utils/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard/",
        element: <Profile />,
      },
      {
        path: "spreadsheets/:spreadsheetId",
        element: <Spreadsheet />,
      },
      {
        path: "spreadsheets/:spreadsheetId/edit",
        element: <SpreadsheetEdit />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
