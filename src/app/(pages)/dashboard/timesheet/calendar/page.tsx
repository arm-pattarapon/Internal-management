"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const calendarData = [
  {
    day: 1,
    tasks: ["Project A: 2h", "Project B: 2h", "Project C: 2h", "Project D: 2h"],
    total: 8,
  },
  {
    day: 2,
    tasks: ["Project A: 2h", "Project C: 2h", "Project D: 1h", "Project E: 1h"],
    total: 8,
  },
  {
    day: 3,
    tasks: [
      "Project A: 2h",
      "Project B: 1h",
      "Project C: 1h",
      "Project D: 1h",
      "Project E: 1h",
    ],
    total: 8,
  },
  {
    day: 4,
    tasks: [
      "Project A: 2h",
      "Project B: 1h",
      "Project C: 2h",
      "Project D: 1h",
      "Project E: 1h",
      "Project F: 1h",
    ],
    total: 8,
  },
  {
    day: 5,
    tasks: ["Project A: 2h", "Project C: 2h", "Project E: 1h", "Project F: 1h"],
    total: 8,
  },
  {
    day: 6,
    tasks: ["Project A: 2h", "Project C: 2h", "Project D: 1h", "Project E: 1h"],
    total: 8,
  },
  {
    day: 7,
    tasks: ["Project A: 2h", "Project C: 2h", "Project D: 1h", "Project E: 1h"],
    total: 8,
  },
  {
    day: 8,
    tasks: ["Project A: 2h", "Project C: 2h", "Project D: 1h", "Project E: 1h"],
    total: 8,
  },
  {
    day: 9,
    tasks: ["Project A: 2h", "Project C: 2h", "Project D: 1h", "Project E: 1h"],
    total: 8,
  },
  {
    day: 10,
    tasks: ["Project A: 2h", "Project C: 2h", "Project D: 1h"],
    total: 5,
  },
];

const CalendarTodo = () => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {calendarData.map(({ day, tasks, total }) => (
        <motion.div
          key={day}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                March {day}, 2025
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {tasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
              <div className="text-right font-semibold text-blue-600">
                Total Hours: {total}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CalendarTodo;
