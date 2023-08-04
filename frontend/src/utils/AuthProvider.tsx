/** @format */

import axios, { AxiosError } from "axios";
import React, { useState } from "react";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const authenticate = async () => {
    try {
      await axios
        .post("http://127.0.0.1:8000/finance/login")
        .then((response) => {
          return response.data.token;
          //   document.cookie = `token=${response.data.token}; path=/`;
        });
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  };

  const handleLogin = async () => {
    const token = await authenticate();

    // setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  //   return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
