"use client";
import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

interface ProjectEntry {
  name: string;
  hours: { [date: string]: number };
}

interface TaskEntry {
  task: string;
  hour: number;
  remark?: string;
}

export default function CalendarTodo() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [projects, setProjects] = useState<ProjectEntry[]>([
    { name: "Project A", hours: {} },
    { name: "Project B", hours: {} },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const isSameMonth =
    format(today, "yyyy-MM") === format(currentMonth, "yyyy-MM");
  const todayDate = isSameMonth ? today.getDate() : null;

  const startDay = startOfMonth(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const daysInMonth = Array.from({ length: endDay.getDate() }, (_, i) => i + 1);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [taskDetails, setTaskDetails] = useState<{
    [key: string]: TaskEntry[];
  }>({});

  useEffect(() => {
    if (scrollRef.current && todayDate) {
      const th = scrollRef.current.querySelector(
        `th[data-day="${todayDate}"]`
      ) as HTMLTableCellElement;
      if (th) {
        th.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  }, [todayDate, currentMonth]);

  const handleHourChange = (
    projectIndex: number,
    day: number,
    value: number
  ) => {
    const newProjects = [...projects];
    const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(day).padStart(
      2,
      "0"
    )}`;
    newProjects[projectIndex].hours[dateKey] = value;
    setProjects(newProjects);
  };

  const handleProjectNameChange = (index: number, newName: string) => {
    const newProjects = [...projects];
    newProjects[index].name = newName;
    setProjects(newProjects);
  };

  const getDayTotal = (day: number) => {
    const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(day).padStart(
      2,
      "0"
    )}`;
    return projects.reduce(
      (total, proj) => total + (proj.hours[dateKey] || 0),
      0
    );
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: `Project ${String.fromCharCode(65 + projects.length)}`,
        hours: {},
      },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleOpenDetail = (projectIndex: number, day: number) => {
    setSelectedProjectIndex(projectIndex);
    setSelectedDay(day);
    setShowDetailModal(true);
  };

  const handleSaveDetail = () => {
    if (selectedProjectIndex === null || selectedDay === null) return;
    const key = `${selectedProjectIndex}-${selectedDay}`;
    const total = (taskDetails[key] || []).reduce((sum, t) => sum + t.hour, 0);
    const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(
      selectedDay
    ).padStart(2, "0")}`;
    const newProjects = [...projects];
    newProjects[selectedProjectIndex].hours[dateKey] = total;
    setProjects(newProjects);
    setShowDetailModal(false);
    setSelectedProjectIndex(null);
    setSelectedDay(null);
  };

  return (
    <div className="overflow-auto mt-10 px-4 pb-10 relative">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Prev
        </button>
        <input
          type="month"
          value={format(currentMonth, "yyyy-MM")}
          onChange={(e) => setCurrentMonth(new Date(e.target.value))}
          className="text-xl font-semibold border border-gray-300 rounded px-4 py-2 cursor-pointer"
        />
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next →
        </button>
      </div>

      <div
        className="overflow-x-auto border rounded-lg scroll-smooth"
        ref={scrollRef}
      >
        <table className="min-w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left px-20 sticky left-0 z-10 bg-gray-100">
                Project / Day
              </th>
              {daysInMonth.map((day) => (
                <th
                  key={day}
                  data-day={day}
                  className={`border p-3 ${
                    todayDate === day
                      ? "bg-blue-100 font-bold text-blue-800"
                      : ""
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project, projectIndex) => (
              <tr key={projectIndex}>
                <td className="border p-3 text-left align-top sticky left-0 z-0 bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) =>
                        handleProjectNameChange(projectIndex, e.target.value)
                      }
                      className="w-full bg-white px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeProject(projectIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </td>
                {daysInMonth.map((day) => {
                  const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(
                    day
                  ).padStart(2, "0")}`;
                  return (
                    <td
                      key={day}
                      className={`border p-2 ${
                        todayDate === day ? "bg-blue-50" : ""
                      }`}
                    >
                      <input
                        type="number"
                        readOnly
                        value={project.hours[dateKey] || ""}
                        onClick={() => handleOpenDetail(projectIndex, day)}
                        className="w-16 text-center px-2 py-1 border border-gray-300 rounded cursor-pointer bg-white"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-blue-100 font-semibold text-blue-900">
              <td className="border p-3 text-left sticky left-0 z-0 bg-blue-100">
                Total Hour
              </td>
              {daysInMonth.map((day) => {
                const total = getDayTotal(day);
                const show = total !== 0;
                const isLow = total < 8;
                return (
                  <td
                    key={day}
                    className={`border p-2 ${
                      todayDate === day ? "bg-blue-50" : ""
                    } ${isLow && show ? "text-red-500 font-bold" : ""}`}
                  >
                    {show ? total : ""}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={addProject}
        className="mt-6 px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + Add Project
      </button>

      {showDetailModal &&
        selectedProjectIndex !== null &&
        selectedDay !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-auto rounded-lg shadow-lg p-6 border">
              <h2 className="text-lg font-bold mb-4">
                Task Details - {projects[selectedProjectIndex].name} on Day{" "}
                {selectedDay}
              </h2>
              {(
                taskDetails[`${selectedProjectIndex}-${selectedDay}`] || []
              ).map((task, index) => (
                <><div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={task.task}
                    onChange={(e) => {
                      const key = `${selectedProjectIndex}-${selectedDay}`;
                      const updated = [...(taskDetails[key] || [])];
                      updated[index].task = e.target.value;
                      setTaskDetails({ ...taskDetails, [key]: updated });
                    } }
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Task" />
                  <input
                    type="number"
                    min={0}
                    value={task.hour}
                    onChange={(e) => {
                      const key = `${selectedProjectIndex}-${selectedDay}`;
                      const updated = [...(taskDetails[key] || [])];
                      updated[index].hour = parseFloat(e.target.value) || 0;
                      setTaskDetails({ ...taskDetails, [key]: updated });
                    } }
                    className="w-24 border px-2 py-1 rounded text-right"
                    placeholder="Hour" />

                  <button
                    onClick={() => {
                      const key = `${selectedProjectIndex}-${selectedDay}`;
                      const updated = [...(taskDetails[key] || [])];
                      updated.splice(index, 1);
                      setTaskDetails({ ...taskDetails, [key]: updated });
                    } }
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    ✕
                  </button>
                </div><input
                    type="text"
                    value={task.remark || ""}
                    onChange={(e) => {
                      const key = `${selectedProjectIndex}-${selectedDay}`;
                      const updated = [...(taskDetails[key] || [])];
                      updated[index].remark = e.target.value;
                      setTaskDetails({ ...taskDetails, [key]: updated });
                    } }
                    className="w-full border px-2 py-1 rounded mb-4"
                    placeholder="Remark (optional)" /></>
              ))}
              <button
                onClick={() => {
                  const key = `${selectedProjectIndex}-${selectedDay}`;
                  const updated = [
                    ...(taskDetails[key] || []),
                    { task: "", hour: 0 },
                  ];
                  setTaskDetails({ ...taskDetails, [key]: updated });
                }}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Task
              </button>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDetail}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
