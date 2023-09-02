/** @format */

import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverRequest } from "./utils";

const AuthContext: any = React.createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const authenticate = async (data: any) => {
    serverRequest(
      "post",
      "finance/login",
      data,
      () => navigate("/"),
      () => setError(true)
    );
  };

  const isAuthenticated = () => {
    serverRequest(
      "get",
      "finance/user",
      undefined,
      (user: any) => user && navigate("/")
    );
  };

  const handleLogout = async () => {
    try {
      await axios
        .post("http://locathost:8000/finance/logout")
        .then((response) => {
          navigate("/");
        });
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  };

  const value = {
    token,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
