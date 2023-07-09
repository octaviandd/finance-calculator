/** @format */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    username: string[];
    email: string[];
    password: string[];
  }>({
    username: [],
    email: [],
    password: [],
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrors(() => ({
      username: [],
      email: [],
      password: [],
    }));
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());

    try {
      await axios
        .post("http://127.0.0.1:8000/finance/register", formJson)
        .then(() => {
          navigate("/login");
        });
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        let data = err?.response?.data as {
          username: string[];
          email: string[];
          password: [];
        };
        setErrors(() => ({
          username: data.username || [],
          email: data.email || [],
          password: data.password || [],
        }));
      } else {
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
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm gap-x-2 flex items-center justify-between">
            <div className="w-full">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="first_name"
                  required
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="last_name"
                  required
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="username"
                autoComplete="username"
                required
                className={
                  errors.username.length < 1
                    ? "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    : "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset ring-red-600 sm:text-sm sm:leading-6"
                }
              />
            </div>
            {errors.username &&
              errors.username.map((error) => (
                <span key={error} className="text-sm mt-2 ml-1 text-red-500">
                  {error}
                </span>
              ))}
          </div>

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
                  errors.email.length < 1
                    ? "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    : "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset ring-red-600 sm:text-sm sm:leading-6"
                }
              />
            </div>
            {errors.email &&
              errors.email.map((error) => (
                <span key={error} className="text-sm mt-2 ml-1 text-red-500">
                  {error}
                </span>
              ))}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={
                  errors.password.length < 1
                    ? "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    : "block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset ring-red-600 sm:text-sm sm:leading-6"
                }
              />
            </div>
            {errors.password &&
              errors.password.map((error) => (
                <span key={error} className="text-sm mt-2 ml-1 text-red-500">
                  {error}
                </span>
              ))}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md dark:bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?
          <Link
            to="/login"
            className="font-semibold leading-6 dark:text-gray-800 hover:text-gray-500 ml-1"
          >
            Login here
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
