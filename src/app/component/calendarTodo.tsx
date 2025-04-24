"use client";
import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import * as XLSX from "xlsx";

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
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [taskDetails, setTaskDetails] = useState<{ [key: string]: TaskEntry[] }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = new Date();
  const isSameMonth = format(today, "yyyy-MM") === format(currentMonth, "yyyy-MM");
  const todayDate = isSameMonth ? today.getDate() : null;

  const startDay = startOfMonth(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const daysInMonth = Array.from({ length: endDay.getDate() }, (_, i) => i + 1);

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    const savedTaskDetails = localStorage.getItem("taskDetails");

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    else
      setProjects([
        { name: "Project A", hours: {} },
        { name: "Project B", hours: {} },
      ]);

    if (savedTaskDetails) setTaskDetails(JSON.parse(savedTaskDetails));
  }, []);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("taskDetails", JSON.stringify(taskDetails));
  }, [taskDetails]);

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

  const handleHourChange = (projectIndex: number, day: number, value: number) => {
    const newProjects = [...projects];
    const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(day).padStart(2, "0")}`;
    newProjects[projectIndex].hours[dateKey] = value;
    setProjects(newProjects);
  };

  const handleProjectNameChange = (index: number, newName: string) => {
    const newProjects = [...projects];
    newProjects[index].name = newName;
    setProjects(newProjects);
  };

  const getDayTotal = (day: number) => {
    const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(day).padStart(2, "0")}`;
    return projects.reduce((total, proj) => total + (proj.hours[dateKey] || 0), 0);
  };

  const getProjectTotal = (project: ProjectEntry) => {
    return Object.values(project.hours).reduce((sum, val) => sum + val, 0);
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
    const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(selectedDay).padStart(2, "0")}`;
    const newProjects = [...projects];
    newProjects[selectedProjectIndex].hours[dateKey] = total;
    setProjects(newProjects);
    setShowDetailModal(false);
    setSelectedProjectIndex(null);
    setSelectedDay(null);
  };

  const exportToExcel = () => {
    const data: any[][] = [["Project", ...daysInMonth.map(day => `${day}`), "Total"]];
    projects.forEach((project) => {
      const row: any[] = [project.name];
      let total = 0;
      daysInMonth.forEach((day) => {
        const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(day).padStart(2, "0")}`;
        const val = project.hours[dateKey] || 0;
        row.push(val);
        total += val;
      });
      row.push(total);
      data.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Hours");
    XLSX.writeFile(wb, `TimeTracking_${format(currentMonth, "yyyy-MM")}.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white border rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100"
          >
            ← Prev
          </button>
          <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100"
          >
            Next →
          </button>
        </div>

        <div className="overflow-auto rounded-lg border" ref={scrollRef}>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-6 py-2 sticky left-0 bg-gray-100 z-10 border-r">
                  Project / Day
                </th>
                {daysInMonth.map((day) => {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dayName = format(date, "EEE");
                  const isWeekend = dayName === "Sat" || dayName === "Sun";
                  return (
                    <th
                      key={day}
                      data-day={day}
                      className={`px-3 py-1 border text-center ${
                        todayDate === day ? "bg-blue-100 text-blue-700 font-bold" : ""
                      } ${isWeekend ? "bg-red-50 text-red-600 font-semibold" : ""}`}
                    >
                      <div className="text-xs">{dayName}{isWeekend ?"": ""}</div>
                      <div>{day}</div>
                    </th>
                  );
                })}
                <th className="px-3 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, projectIndex) => (
                <tr key={projectIndex}>
                  <td className="sticky left-0 z-0 bg-white border-r px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleProjectNameChange(projectIndex, e.target.value)}
                        className="min-w-[140px] px-2 py-1 border rounded"
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
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isWeekend = ["Sat", "Sun"].includes(format(date, "EEE"));
                    const dateKey = `${format(currentMonth, "yyyy-MM")}-${String(day).padStart(2, "0")}`;
                    return (
                      <td
                        key={day}
                        className={`border px-2 py-1 text-center cursor-pointer ${isWeekend ? "bg-red-50" : ""}`}
                        onClick={() => handleOpenDetail(projectIndex, day)}
                      >
                        <input
                          type="text"
                          readOnly
                          value={project.hours[dateKey] || ""}
                          className="w-12 text-center border rounded bg-white cursor-pointer"
                        />
                      </td>
                    );
                  })}
                  <td className="text-center border font-semibold bg-gray-50">
                    {getProjectTotal(project)}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-semibold text-blue-900">
                <td className="sticky left-0 z-0 bg-blue-50 px-4 py-2 border-r">Total Hour</td>
                {daysInMonth.map((day) => {
                  const total = getDayTotal(day);
                  const isLow = total < 8;
                  return (
                    <td
                      key={day}
                      className={`px-3 py-1 border text-center ${isLow && total > 0 ? "text-red-500 font-bold" : ""}`}
                    >
                      {total > 0 ? total : ""}
                    </td>
                  );
                })}
                <td className="border px-3 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={addProject}
            className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Add Project
          </button>
          <button
            onClick={exportToExcel}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Excel
          </button>
        </div>

        {showDetailModal && selectedProjectIndex !== null && selectedDay !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4">
                Task Details - {projects[selectedProjectIndex].name} on Day {selectedDay}
              </h2>
              {(taskDetails[`${selectedProjectIndex}-${selectedDay}`] || []).map((task, index) => (
                <div key={index} className="mb-2">
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={task.task}
                      onChange={(e) => {
                        const key = `${selectedProjectIndex}-${selectedDay}`;
                        const updated = [...(taskDetails[key] || [])];
                        updated[index].task = e.target.value;
                        setTaskDetails({ ...taskDetails, [key]: updated });
                      }}
                      className="flex-1 border px-2 py-1 rounded"
                      placeholder="Task"
                    />
                    <input
                      type="number"
                      min={0}
                      value={task.hour}
                      onChange={(e) => {
                        const key = `${selectedProjectIndex}-${selectedDay}`;
                        const updated = [...(taskDetails[key] || [])];
                        updated[index].hour = parseFloat(e.target.value) || 0;
                        setTaskDetails({ ...taskDetails, [key]: updated });
                      }}
                      className="w-24 border px-2 py-1 rounded text-right"
                      placeholder="Hour"
                    />
                    <button
                      onClick={() => {
                        const key = `${selectedProjectIndex}-${selectedDay}`;
                        const updated = [...(taskDetails[key] || [])];
                        updated.splice(index, 1);
                        setTaskDetails({ ...taskDetails, [key]: updated });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="text"
                    value={task.remark || ""}
                    onChange={(e) => {
                      const key = `${selectedProjectIndex}-${selectedDay}`;
                      const updated = [...(taskDetails[key] || [])];
                      updated[index].remark = e.target.value;
                      setTaskDetails({ ...taskDetails, [key]: updated });
                    }}
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Remark (optional)"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const key = `${selectedProjectIndex}-${selectedDay}`;
                  const updated = [...(taskDetails[key] || []), { task: "", hour: 0 }];
                  setTaskDetails({ ...taskDetails, [key]: updated });
                }}
                className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Task
              </button>
              <div className="flex justify-end gap-2">
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
    </div>
  );
}
