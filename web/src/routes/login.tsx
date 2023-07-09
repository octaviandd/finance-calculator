/** @format */

import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {};

export default function LoginPage({}: Props) {
  const navigate = useNavigate();
  const [hasError, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(false);
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());

    try {
      await axios
        .post("http://127.0.0.1:8000/finance/login", formJson)
        .then((response) => {
          console.log(response);
          document.cookie = `token=${response.data.token}; path=/`;
          navigate("/spreadsheets");
        });
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  };
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      {hasError && (
        <div
          className="p-4 mb-4 mt-6 text-sm text-red-800 rounded-lg border-black border-2 bg-white-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm"
          role="alert"
        >
          <span className="font-medium">Error!</span> Invalid credentials.
        </div>
      )}

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={
                  !hasError
                    ? "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    : "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset ring-red-600 sm:text-sm sm:leading-6"
                }
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold dark:text-gray-800 hover:text-gray-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={
                  !hasError
                    ? "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    : "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset ring-red-600 sm:text-sm sm:leading-6"
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md dark:bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <Link
            to="/register"
            className="font-semibold leading-6 dark:text-gray-800  hover:text-gray-500 ml-1"
          >
            Register here
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex items-center justify-between">
        <span className="h-[0.5px] w-full bg-black"></span>
        <span className="w-full px-3 whitespace-nowrap text-zinc-400">
          Or continue with
        </span>
        <span className="h-[0.5px] w-full bg-black"></span>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex gap-x-4 items-center justify-between">
        <a href="" className="w-full">
          <button
            type="button"
            className="flex w-full justify-center pr-3 items-center rounded-sm bg-[#3F7DE7] pl-1 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <img
              className="bg-white mr-3"
              height="22"
              width="22"
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            />
            <span>Google</span>
          </button>
        </a>
        <a href="" className="w-full">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-sm bg-[#24292E] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <img
              className="bg-transparent mr-3"
              height="22"
              width="22"
              src="github-mark-white.png"
            />
            <span>GitHub</span>
          </button>
        </a>
      </div>
    </div>
  );
}
