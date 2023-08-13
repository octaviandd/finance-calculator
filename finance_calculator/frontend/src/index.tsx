/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/public-sans";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error";
import Period from "./routes/period";
import LoginPage from "./routes/login";
import RegisterPage from "./routes/register";
import PeriodEdit from "./routes/period-edit";
import Profile from "./components/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/profile/",
        element: <Profile />,
      },
      {
        path: "monthly-period/:periodId",
        element: <Period />,
      },
      {
        path: "monthly-period/:periodId/edit",
        element: <PeriodEdit />,
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
