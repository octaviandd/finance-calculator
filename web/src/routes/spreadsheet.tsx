/** @format */

import React, { useState, useEffect } from "react";
import { Form, Link, useLoaderData, useParams } from "react-router-dom";
import { ContactInterface } from "../types/Contacts";
import { getSpreadsheet } from "../utils/contact";
import axios, { AxiosError } from "axios";
import { getCookie } from "../utils/cookie";

export async function loader({ params }: any) {
  const contact = await getSpreadsheet(params.contactId);
  return { contact };
}

interface SpreadSheet {
  title: string;
  expenses: [{ id: 0; title: string; amount: number; planned_amount: number }];
  incomes: [{ id: 0; title: string; amount: number; planned_amount: number }];
  total_income: number;
  total_saved_this_period: number;
  total_savings: number;
  total_spend: number;
  start_balance: number;
}

export default function Spreadsheets() {
  const [error, setError] = useState(false);
  const [toastState, setToastState] = useState(true);
  const [isModalOpen, setModalState] = useState(false);
  const { spreadsheetId } = useParams();
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet>({
    title: "",
    expenses: [{ id: 0, title: "", amount: 0, planned_amount: 0 }],
    incomes: [{ id: 0, title: "", amount: 0, planned_amount: 0 }],
    total_income: 0,
    total_saved_this_period: 0,
    total_savings: 0,
    total_spend: 0,
    start_balance: 0,
  });

  async function getData() {
    const token = getCookie("token");
    try {
      await axios
        .get(`http://127.0.0.1:8000/finance/spreadsheets/${spreadsheetId}`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => {
          setSpreadSheet((prevState) => ({
            ...prevState,
            title: res.data.title,
            expenses: res.data.expenses,
            incomes: res.data.incomes,
            total_income: res.data.total_income,
            total_saved_this_period: res.data.total_saved_this_period,
            total_savings: res.data.total_savings,
            total_spend: res.data.total_spend,
            start_balance: res.data.start_balance,
          }));
        });
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isAxiosError(err)) {
        setError(true);
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-4 pl-8 sm:ml-64 mt-20 flex flex-col min-h-screen relative">
      {toastState && (
        <div
          id="toast-default"
          className="flex items-center w-full p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Get Started</span>
          </div>
          <div className="ml-3 text-sm font-normal">
            Set your starting balance in cell L8, then customize your categories
            and planned spending amounts in the 'Income' and 'Expenses' tables
            below. <br></br>
            As you enter data in the 'Transactions' tab, this sheet will
            automatically update to show a summary of your spending for the
            month.
          </div>
          <button
            onClick={() => setToastState(false)}
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-default"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      )}

      <h1 className="mt-6 text-4xl text-black inline-block text-bold mb-4">
        {spreadSheet.title}'s report
      </h1>
      <div className="inline-flex">
        <Link to={`/spreadsheets/${spreadsheetId}/edit`}>
          <button
            type="button"
            className="text-white px-5 py-3 bg-gradient-to-r self-start inline-flex items-center justify-between from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center mr-2 mb-2"
          >
            <span>Add Transactions</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-2"
              fill="white"
              viewBox="0 0 448 512"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          </button>
        </Link>
      </div>

      <div className="my-10 flex justify-around w-full">
        <div className="max-w-[400px] gap-x-4 flex items-center">
          <div>
            <div className="bg-[#334960] max-h-[400px] h-[200px] w-[70px] ml-auto"></div>
            <div className="font-medium">
              <p className="text-xl text-[#334960]">START BALANCE</p>
              <p className="text-right text-[#334960] italic">
                £{spreadSheet.start_balance}
              </p>
            </div>
          </div>
          <div>
            <div className="bg-[#F46524] max-h-[400px] h-[200px] w-[70px] mr-auto"></div>
            <div className="font-medium">
              <p className="text-xl text-[#F46524]">END BALANCE</p>
              <p className="italic text-[#F46524]">
                £
                {spreadSheet.start_balance +
                  spreadSheet.total_saved_this_period}
              </p>
            </div>
          </div>
        </div>
        <div className="py-10 px-20 bg-[#ECEDEF]">
          <div className="border-b border-dashed border-neutral-400 pb-5">
            <p className="text-3xl text-center">£{spreadSheet.total_savings}</p>
            <p className="text-center">Increase in total savings</p>
          </div>
          <div className="pt-6">
            <p className="text-3xl text-center">
              {spreadSheet.total_saved_this_period}
            </p>
            <p className="text-center">Saved this month</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg grow">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Expenses
                </th>
                <th scope="col" className="px-6 py-3">
                  Planned
                </th>
                <th scope="col" className="px-6 py-3">
                  Actual
                </th>
                <th scope="col" className="px-6 py-3">
                  Diff
                </th>
              </tr>
            </thead>
            <tbody>
              {spreadSheet &&
                spreadSheet.expenses.map((expense) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={expense.id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {expense.title}
                    </th>
                    <td className="px-6 py-4">{expense.planned_amount}</td>
                    <td className="px-6 py-4">{expense.amount}</td>
                    <td className="px-6 py-4">
                      {expense.planned_amount - expense.amount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg grow self-start">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Income
                </th>
                <th scope="col" className="px-6 py-3">
                  Planned
                </th>
                <th scope="col" className="px-6 py-3">
                  Actual
                </th>
                <th scope="col" className="px-6 py-3">
                  Diff
                </th>
              </tr>
            </thead>
            <tbody>
              {spreadSheet &&
                spreadSheet.incomes.map((income) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={income.id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {income.title}
                    </th>
                    <td className="px-6 py-4">{income.planned_amount}</td>
                    <td className="px-6 py-4">{income.amount}</td>
                    <td className="px-6 py-4">
                      {income.planned_amount - income.amount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="large-modal"
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] flex items-center justify-center max-h-full"
        >
          <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Large modal
                </h3>
                <button
                  onClick={() => setModalState(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="large-modal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  With less than a month to go before the European Union enacts
                  new consumer privacy laws for its citizens, companies around
                  the world are updating their terms of service agreements to
                  comply.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  The European Union’s General Data Protection Regulation
                  (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                  common set of data rights in the European Union. It requires
                  organizations to notify users as soon as possible of high-risk
                  data breaches that could personally affect them.
                </p>
              </div>
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="large-modal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
                <button
                  data-modal-hide="large-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
