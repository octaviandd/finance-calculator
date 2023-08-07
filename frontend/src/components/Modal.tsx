/** @format */

import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import { DollarSign } from "react-feather";

export default function BasicModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Function;
}) {
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
          <Typography id="modal-desc" textColor="text.tertiary">
            <List
              sx={{
                mt: "auto",
                flexGrow: 0,
                "--ListItem-radius": "8px",
                "--List-gap": "8px",
              }}
            >
              <ListItem>
                <ListItemButton>
                  <ListItemDecorator>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      version="1.1"
                      id="Layer_1"
                      width="22"
                      height="22"
                      stroke="currentColor"
                      viewBox="0 0 612.002 612.002"
                    >
                      <g>
                        <g>
                          <g>
                            <path d="M212.287,454.668V330.02h224.348v-51.456H212.287V162.92c0-61.994,51.155-111.464,113.27-111.464     c62.111,0,113.264,50.102,113.264,113.907h51.457C490.277,72.742,416.039,0,325.557,0c-90.487,0-164.726,72.553-164.726,162.92     v115.646h-39.106v51.456h39.106v124.649c0,58.178-24.699,87.666-39.106,100.114v53.271l1.931,3.945H488.09v-51.456H185.769     C200.915,535.846,212.287,501.685,212.287,454.668z" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </ListItemDecorator>
                  <ListItemContent>
                    <Box>British Pounds</Box>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <ListItemDecorator>
                    <DollarSign></DollarSign>
                  </ListItemDecorator>
                  <ListItemContent>
                    <Box>US Dollars</Box>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <ListItemDecorator>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      height="22"
                      width="22"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 511.976 511.976"
                    >
                      <g>
                        <g>
                          <path d="M462.323,440.044c-3.508,0-6.98,0.936-10.028,2.704c-32.78,19.032-70.192,29.204-108.18,29.204    c-91.9,0-173.012-59.864-203.564-143.864h185.24c11.036,0,20.012-8.968,20.012-20c0-11.04-8.976-20-20.012-20H130.583    c-1.596-12-2.412-21.468-2.412-32.004c0-10.532,0.812-19.996,2.412-31.996h195.204c11.036,0,20.012-8.968,20.012-20    c0-11.04-8.976-20-20.012-20h-185.24c30.556-88,111.668-144.068,203.568-144.068c37.988,0,75.4,10.028,108.188,29.052    c3.04,1.764,6.512,2.688,10.02,2.688c7.112,0,13.756-3.832,17.328-9.98c5.536-9.54,2.276-21.816-7.268-27.364    C433.495,11.86,389.147,0,344.119,0C230.911,0.004,130.367,76.088,98.531,184.088H49.635c-11.028,0-20.008,8.96-20.008,20    c0,11.032,8.98,20,20.008,20h40.556c-1.356,12-2.036,21.496-2.036,31.996c0,10.504,0.68,20.004,2.036,32.004H49.635    c-11.028,0-20.008,8.96-20.008,20c0,11.032,8.98,20,20.008,20h48.896c31.836,108,132.384,183.888,245.584,183.888    c45.032,0,89.38-11.98,128.264-34.552c9.548-5.54,12.804-17.832,7.26-27.376C476.079,443.896,469.435,440.044,462.323,440.044z" />
                        </g>
                      </g>
                    </svg>
                  </ListItemDecorator>
                  <ListItemContent>
                    <Box>Euros</Box>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            </List>
          </Typography>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
