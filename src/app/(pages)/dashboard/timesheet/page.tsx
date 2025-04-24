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
      {/* 👉 CalendarTodo section added here */}
      <div className="mt-10 flex justify-center w-full">
        <CalendarTodo />
      </div>
    </div>
  );
}
