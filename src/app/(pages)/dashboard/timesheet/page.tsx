/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CalendarTodo from "@/app/component/calendarTodo";

interface TimeSheet {
  projectname: string;
  date: string;
  hoursone: number;
  hourstwo: number;
  details: string;
  role: string;
}

export default function TimesheetPage() {
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedTimeSheets = JSON.parse(
      localStorage.getItem("timeSheets") ?? "[]"
    );
    setTimeSheets(savedTimeSheets);
  }, []);

  const handleClick = () => {
    router.push("/dashboard/timesheet/createsheet");
  };

  const handleEdit = (sheetToEdit: TimeSheet, indexToEdit: number) => {
    localStorage.setItem(
      "editSheet",
      JSON.stringify({ index: indexToEdit, data: sheetToEdit })
    );
    router.push("/dashboard/timesheet/createsheet");
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedSheets = timeSheets.filter(
      (_, index) => index !== indexToDelete
    );
    setTimeSheets(updatedSheets);
    localStorage.setItem("timeSheets", JSON.stringify(updatedSheets));
  };

  const filteredSheets = timeSheets.filter((sheet) =>
    sheet.projectname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        {/* <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + New Time Sheet
        </button> */}

        <form className="w-full md:max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Search project..."
            />
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {filteredSheets.map((sheet, index) => (
          <div
            key={index}
            className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800"
          >
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              {sheet.projectname}
            </h5>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {sheet.date}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Role: {sheet.role}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Time: {sheet.hoursone} - {sheet.hourstwo} hrs
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {sheet.details}
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleEdit(sheet, index)}
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-100 hover:bg-red-200 text-red-600 py-1 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 👉 CalendarTodo section added here */}
      <div className="mt-10">
        <CalendarTodo />
      </div>
    </div>
  );
}
