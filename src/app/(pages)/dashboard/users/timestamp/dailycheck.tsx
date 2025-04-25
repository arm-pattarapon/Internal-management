"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hour}:${minute}:${second}`;
}

export default function CheckPage() {
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [remark, setRemark] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    if (!checkInTime) return;
    setCheckOutTime(new Date());
  };

  const isCheckInDisabled = checkInTime !== null;
  const isCheckOutVisible = checkInTime !== null;
  const isCheckOutDisabled = checkOutTime !== null;

  return (
    <div className="min-h-screen flex justify-center pt-10 p-6 font-sans">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-md w-full space-y-6 max-h-[450px] ">
        {/* Card Title */}
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
          Daily Check In/Out
        </h2>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={isCheckInDisabled}
            className={`w-full flex items-center justify-center gap-2 text-white font-medium rounded-full text-sm px-5 py-2.5 
              text-center focus:outline-none focus:ring-4 transition-all duration-200 ${
                isCheckInDisabled ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            style={{
              backgroundColor: isCheckInDisabled ? "#d1d5db" : "#3D90D7",
            }}
            onMouseEnter={(e) => {
              if (!isCheckInDisabled)
                e.currentTarget.style.backgroundColor = "#3483c4";
            }}
            onMouseLeave={(e) => {
              if (!isCheckInDisabled)
                e.currentTarget.style.backgroundColor = "#3D90D7";
            }}
          >
            <CheckCircleIcon className="w-5 h-5" />
            Check In
          </button>

          {isCheckOutVisible && (
            <button
              type="button"
              onClick={handleCheckOut}
              disabled={isCheckOutDisabled}
              className={`w-full flex items-center justify-center gap-2 text-white font-medium rounded-full text-sm px-5 py-2.5 
                text-center focus:outline-none focus:ring-4 transition-all duration-200 ${
                  isCheckOutDisabled ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              style={{
                backgroundColor: isCheckOutDisabled ? "#d1d5db" : "#FF8282",
              }}
              onMouseEnter={(e) => {
                if (!isCheckOutDisabled)
                  e.currentTarget.style.backgroundColor = "#e56d6d";
              }}
              onMouseLeave={(e) => {
                if (!isCheckOutDisabled)
                  e.currentTarget.style.backgroundColor = "#FF8282";
              }}
            >
              <ClockIcon className="w-5 h-5" />
              Check Out
            </button>
          )}
        </div>

        {/* Current Time */}
        <div className="text-gray-700 dark:text-gray-300">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {/* ⏰ Icon */}
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Current Time
          </h3>
          <p className="pl-8">{formatDate(currentTime)}</p>
        </div>

        {/* Time Stamp */}
        <div className="text-gray-700 dark:text-gray-300">
          <h3 className="text-lg font-semibold mt-2 flex items-center gap-2">
            {/* 🕑 Icon */}
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
              />
            </svg>
            Time Stamp
          </h3>
          <div className="pl-8 space-y-1 text-sm">
            <div className="flex">
              <span className="font-semibold w-24">Check In:</span>
              <span>{checkInTime ? formatDate(checkInTime) : "--"}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Check Out:</span>
              <span>{checkOutTime ? formatDate(checkOutTime) : "--"}</span>
            </div>
          </div>
        </div>

        {/* Remark */}
        <div>
          <label
            htmlFor="remark"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <PencilSquareIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            Remark
          </label>
          <textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={3}
            className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-y 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white 
              dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="Write your remarks here..."
          />
        </div>
      </div>
    </div>
  );
}
