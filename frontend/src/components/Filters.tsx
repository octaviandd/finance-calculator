/** @format */

import { FormControl, Button } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import React from "react";
import { PlusCircle } from "react-feather";

type Props = {
  addRow: Function | undefined;
};

export const Filters = ({ addRow }: Props) => {
  return (
    <React.Fragment>
      <FormControl size="sm" sx={{ marginLeft: "auto" }}>
        {addRow && (
          <Button variant="soft" sx={{ marginTop: "auto" }}>
            <Typography sx={{ marginRight: 1 }} level="title-sm">
              Add Row
            </Typography>
            <PlusCircle onClick={() => addRow()}></PlusCircle>
          </Button>
        )}
      </FormControl>
    </React.Fragment>
  );
};
