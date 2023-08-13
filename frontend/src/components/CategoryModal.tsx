/** @format */

import React, { useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import {
  Box,
  CircularProgress,
  FormControl,
  Input,
  List,
  ListItem,
  ListItemContent,
} from "@mui/joy";
import { Check } from "react-feather";
import { Category } from "../types/Category";

export default function BasicModal({
  open,
  setOpen,
  createCategory,
  categories,
}: {
  open: boolean;
  setOpen: Function;
  createCategory: Function;
  categories: Category[];
}) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  const createItem = () => {
    createCategory(inputValue);
    setOpen(false);
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
            Add Category
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
              <CircularProgress />
            </Box>
          )}
          <Box>
            <FormControl size="sm" sx={{ position: "relative" }}>
              <Input
                type="text"
                placeholder="Groceries"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={(e) => inputValue && e.key === "Enter" && createItem()}
              ></Input>
              {inputValue.length > 0 && (
                <Box
                  onClick={() => createItem()}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "2.5%",
                    transform: "translate(0, -50%)",
                    padding: "2px",
                    borderRadius: "100%",
                    cursor: "pointer",
                    ":hover": {
                      backgroundColor: "rgb(80,188,80, 0.2)",
                    },
                  }}
                >
                  <Check size={18} color="rgb(80,188,80)"></Check>
                </Box>
              )}
            </FormControl>
          </Box>
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
            mt={2}
          >
            Current Categories
          </Typography>
          <Box
            sx={{
              marginTop: 1,
              border: "1px solid grey",
              borderRadius: "8px",
              borderColor: "#e5e7eb",
            }}
          >
            <List>
              {categories.map((category) => (
                <ListItem key={category.id}>
                  <ListItemContent>{category.title}</ListItemContent>
                </ListItem>
              ))}
            </List>
          </Box>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
