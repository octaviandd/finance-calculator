/** @format */

import { Box, Sheet, Typography } from "@mui/joy";
import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

type Props = {};

export default function ErrorPage({}: Props) {
  const error = useRouteError();
  let errorMessage: string = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
  }

  return (
    <Sheet
      sx={{
        bgcolor: "background.body",
        flex: 1,
        width: "100%",
        height: "100dvh",
        mx: "auto",
        display: "flex",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100dvh",
          alignItems: "center",
        }}
      >
        <Typography sx={{ display: "block" }}>Oops!</Typography>
        <Typography>Sorry, an unexpected error has occurred.</Typography>
        <Typography>
          <i>{errorMessage}</i>
        </Typography>
      </Box>
    </Sheet>
  );
}
