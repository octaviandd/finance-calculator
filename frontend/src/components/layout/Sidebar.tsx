/** @format */

import React, { useContext, useEffect, useState } from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import ColorSchemeToggle from "../../utils/ColorSchemeToggle";
import { closeSidebar } from "../../utils/utils";
import { LogOut, Coffee, Home, BarChart2, Filter } from "react-feather";
import { Link } from "react-router-dom";
import Modal from "../Modal";
import { Store } from "../../Store";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { currency } = useContext(Store);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: {
          xs: "fixed",
          md: "sticky",
        },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 1.5,
        py: 3,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "224px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "256px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "background.body",
          opacity: "calc(var(--SideNavigation-slideIn, 0) - 0.2)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography fontWeight="xl">Finance Tracker</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List
          sx={{
            "--ListItem-radius": "8px",
            "--List-gap": "4px",
            "--List-nestedInsetStart": "40px",
          }}
        >
          <Link to="/">
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Home />
                </ListItemDecorator>
                <ListItemContent>Home</ListItemContent>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/profile">
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <BarChart2 />
                </ListItemDecorator>
                <ListItemContent>Profile</ListItemContent>
              </ListItemButton>
            </ListItem>
          </Link>

          <ListItem
            nested
            sx={{ my: 1 }}
            startAction={
              <IconButton
                variant="plain"
                size="sm"
                color="neutral"
                onClick={() => setOpen(!open)}
              ></IconButton>
            }
          >
            <ListItem>
              <ListItemDecorator>
                <Filter />
              </ListItemDecorator>
              <Typography
                level="inherit"
                sx={{
                  fontWeight: open ? "bold" : undefined,
                  color: open ? "text.primary" : "inherit",
                }}
              >
                Quick Filters
              </Typography>
              <Typography component="span" level="body-sm" sx={{ ml: 1 }}>
                4
              </Typography>
            </ListItem>
            {open && (
              <List sx={{ "--ListItem-paddingY": "8px" }}>
                <ListItem>
                  <ListItemButton>Overview</ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>Last month</ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>Last 3 months</ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>Last 6 months</ListItemButton>
                </ListItem>
              </List>
            )}
          </ListItem>
        </List>
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
              <ListItemDecorator sx={{ fontSize: "24px" }}>
                {currency.symbol}
              </ListItemDecorator>
              <ListItemContent>
                <Box onClick={() => setOpenModal(true)}>Change Currency</Box>
                <Modal open={openModal} setOpen={setOpenModal}></Modal>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator>
                <Coffee />
              </ListItemDecorator>
              <ListItemContent>Buy me a Coffee</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator>
                <LogOut />
              </ListItemDecorator>
              <ListItemContent>Log Out</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar variant="outlined" src="/static/images/avatar/3.jpg" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography fontSize="sm" fontWeight="lg">
            Octavian D.
          </Typography>
          <Typography level="body-sm">octaviandd@yahoo.com</Typography>
        </Box>
        <IconButton variant="plain" color="neutral">
          <i data-feather="log-out" />
        </IconButton>
      </Box>
    </Sheet>
  );
}
