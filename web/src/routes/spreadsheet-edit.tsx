/** @format */

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";

type Props = {};

export default function SpreadsheetEdit({}: Props) {
  const [categories, setCategories] = useState();
  const [error, setError] = useState(false);
  const { spreadsheetId } = useParams();

  async function getSpreadSheetData() {
    try {
      await axios
        .get(`http://127.0.0.1:8000/finance/spreadsheets/${spreadsheetId}/edit`)
        .then((res) => console.log(res));
    } catch (error) {
      let err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  }

  useEffect(() => {
    getSpreadSheetData();
  });

  return (
    <div className="p-4 pl-8 sm:ml-64 mt-20 flex flex-col min-h-screen relative">
      <div className="grid grid-col-auto  gap-x-4">
        <div className="mb-10 pr-4 border-neutral-300">
          <h1 className="text-3xl text-[#F46524] font-medium text-center border-b border-neutral-300 pb-6">
            Expenses
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <input type="date" />
                  </th>
                  <td className="px-6 py-4">
                    <div>
                      <input
                        type="tel"
                        id="amount"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <input
                        type="text"
                        id="description"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      id="dropdownDefaultButton"
                      data-dropdown-toggle="dropdown"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                    >
                      Select Category{" "}
                      <svg
                        className="w-4 h-4 ml-2"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    <div
                      id="dropdown"
                      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Dashboard
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Settings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Earnings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Microsoft Surface Pro
                  </th>
                  <td className="px-6 py-4">White</td>
                  <td className="px-6 py-4">Laptop PC</td>
                  <td className="px-6 py-4">$1999</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Magic Mouse 2
                  </th>
                  <td className="px-6 py-4">Black</td>
                  <td className="px-6 py-4">Accessories</td>
                  <td className="px-6 py-4">$99</td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Google Pixel Phone
                  </th>
                  <td className="px-6 py-4">Gray</td>
                  <td className="px-6 py-4">Phone</td>
                  <td className="px-6 py-4">$799</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Apple Watch 5
                  </th>
                  <td className="px-6 py-4">Red</td>
                  <td className="px-6 py-4">Wearables</td>
                  <td className="px-6 py-4">$999</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h1 className="text-3xl text-[#F46524] font-medium text-center border-b border-neutral-300 pb-6">
            Income
          </h1>
          <div className="grid-rows-auto grid-cols-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
