/** @format */

import React from "react";
import MyDropzone from "../utils/dropzone";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../utils/Sidebar";

type Props = {};

export default function Dashboard({}: Props) {
  return (
    <div>
      <Sidebar></Sidebar>
      <Outlet></Outlet>
    </div>
  );
}
