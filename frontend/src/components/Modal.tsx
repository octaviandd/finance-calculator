/** @format */

import React, { useContext, useEffect, useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import { serverRequest } from "../utils/utils";
import { Store } from "../Store";
import { Currency } from "../types/Currency";

export default function BasicModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Function;
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setGlobalCurrency } = useContext(Store);
  const [localCurrencies, setLocalCurrencies] = useState([]);

  const getCurrencies = () => {
    serverRequest(
      "get",
      `finance/get-currencies`,
      undefined,
      (data: any) => {
        setLocalCurrencies(data);
      },
      setError
    );
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  const handleCurrencyChange = ({ currencyId }: { currencyId: string }) => {
    setLoading(true);
    serverRequest(
      "post",
      `finance/set-currency`,
      currencyId,
      (data: any) => {
        setGlobalCurrency(data);
        setLoading(false);
        setOpen(false);
      },
      setError
    );
  };

  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            minWidth: 400,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: "calc(-1/4 * var(--IconButton-size))",
              right: "calc(-1/4 * var(--IconButton-size))",
              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
              borderRadius: "50%",
              bgcolor: "background.surface",
            }}
          />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Select currency
          </Typography>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                zIndex: 20,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{}} />
            </Box>
          )}
          <List sx={loading ? { "opacity:": 0 } : { opacity: 1 }}>
            {localCurrencies.map((currency: Currency) => (
              <ListItem
                key={currency.id}
                onClick={() =>
                  handleCurrencyChange({
                    currencyId: currency.id,
                  })
                }
              >
                <ListItemButton>
                  <ListItemDecorator>{currency.symbol}</ListItemDecorator>
                  <ListItemContent>
                    <Box>{currency.title}</Box>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
