"use client";

import { useEffect, useMemo, useState } from "react";
import Column from "./_components/Column";
import { Id, Project } from "./type";
import Link from "next/link";
import { Button, Dialog, DialogPanel, DialogTitle, Field, Input } from '@headlessui/react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import Card from "./_components/Card";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";

interface Column {
  id: string;
  title: string;
}

type Inputs = {
  status:string
}

export default function projectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [columns, setColumns] = useState<Column[]>([]);
  const columnIds = useMemo(() => {
    return columns.map(columns => columns.id)
  }, [columns])

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);


  const [isNewStatusDialogOpen, setIsNewStatusDialogOpen] = useState(false)


  function toggleNewStatusDialog() {
    setIsNewStatusDialogOpen(!isNewStatusDialogOpen)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const submitNewStatus: SubmitHandler<Inputs> = async ({status}) => {
    setColumns((column)=>{
      const newColumn = {
        id: generateId(),
        title: status,
      }
      return [...column, newColumn]
    })
    toggleNewStatusDialog();
    reset();
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function deleteProject(id: Id) {
    const newProjects = projects.filter((project) => project.id !== id);
    setProjects(newProjects);
  }

  function deleteColumn(id: Id) {
    const newColumn = columns.filter((column) => column.id !== id)
    setColumns(newColumn)
  }

  function setStatus(id:Id, status:string){
    setColumns((columns) =>
      columns.map((column) =>
        column.id === id ? { ...column, title: status } : column
      )
    );
  }

  function onDragStart(event: DragStartEvent) {
    console.log("draging :", event.active);
    const type = event.active.data.current?.type
    setActiveColumn(null)
    setActiveProject(null)

    if (type === "Project") {
      setActiveProject(event.active.data.current?.project);
      return;
    } else if (type === "Column") {
      setActiveColumn(event.active.data.current?.column);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // console.log("project after move: ", projects);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    console.log('active', active);
    console.log('over', over);

    const type = active.data.current?.type
    if (type === "Column") {
      setColumns((columns) => {
        const activeIndex = columns.findIndex(
          (column) => column.id === activeId
        );
        const overIndex = columns.findIndex((column) => column.id === overId);

        return arrayMove(columns, activeIndex, overIndex);
      });
    }

  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    console.log("drag over: ", over, "active: ", active);

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isProjectActive = active.data.current?.type === "Project";
    const isProjectOver = over.data.current?.type === "Project";

    if (!isProjectActive) return;

    if (!(isProjectActive && isProjectOver)) {
      const activeProjectColumnId = active.data.current?.project.columnId;
      const overColumnId = over.data.current?.column.id;
      console.log('test');


      setProjects((projects) => {
        if (activeProjectColumnId === overColumnId) return projects;
        const activeProject = projects.find(
          (project) => project.id === activeId
        );
        const newProject = projects.map((project) => {
          if (project.id === activeProject?.id) {
            return {
              ...project,
              columnId: overColumnId,
            };
          }
          return project;
        });

        return newProject;
      });
    } else {
      const activeProjectColumnId = active.data.current?.project.columnId;
      const overProjectColumnId = over.data.current?.project.columnId;
      if (activeProjectColumnId === overProjectColumnId) return;
      setProjects((projects) => {
        const activeProject = projects.find(
          (project) => project.id === activeId
        );
        const newProject = projects.map((project) => {
          if (project.id === activeProject?.id) {
            return {
              ...project,
              columnId: overProjectColumnId,
            };
          }
          return project;
        });

        return newProject;
      });
    }
  }

  function generateId() {
    return crypto.randomUUID()
  }

  useEffect(() => {
    setColumns([
      { id: 'columnId-1', title: "Backlog" },
      { id: 'columnId-2', title: "In Progress" },
      { id: 'columnId-3', title: "Completed" },
    ]);

    setProjects([
      {
        id: generateId(),
        columnId: `columnId-1`,
        title: "Project Alpha",
        description: "Initial project setup",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-02"),
      },
      {
        id: generateId(),
        columnId: `columnId-1`,
        title: "Project Beta",
        description: "Research and development",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-05"),
      },
      {
        id: generateId(),
        columnId: `columnId-1`,
        title: "Project Epsilon",
        description: "Requirement gathering",
        createdAt: new Date("2025-03-01"),
        updatedAt: new Date("2025-03-03"),
      },
      {
        id: generateId(),
        columnId: `columnId-1`,
        title: "Project Epsilon",
        description: "Requirement gathering",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-03"),
      },
      {
        id: generateId(),
        columnId: `columnId-1`,
        title: "Project Epsilon",
        description: "Requirement gathering",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-03"),
      },
    ]);
  }, []);

  return (
    <div className="bg-white rounded shadow-sm p-5 w-full h-full overflow-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={pointerWithin}
      >
        <div className="flex flex-col h-full">
          <div className="text-[24px] text-left ">Overview</div>
          <div className="text-left text-[12px] text-gray-400">
            Edit or modify all card as you want
          </div>
          <hr className="border-1 rounded text-gray-300 mt-5 mb-3" />

          <div className="grid grid-cols-3 gap-5 mb-3 ">
            <div>
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-3.5 h-3.5 text-gray-500 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
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
                  id="default-search"
                  className="block w-full ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F0F6FF] focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Search Projects"
                />
              </div>
            </div>
            <div className="col-span-2 flex space-x-5">
              <div className="w-50">
                <label
                  htmlFor="datepick"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only"
                >
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="datepick"
                    className="block w-full py-2 px-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F0F6FF] focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <Link
                href="./projects/newproject"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3.5 rounded"
              >
                + Project
              </Link>
              <div onClick={toggleNewStatusDialog}
                className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-3.5 rounded hover:cursor-pointer"
              >
                + Status
              </div>
              <Dialog open={isNewStatusDialogOpen} as="div" className="relative z-10 focus:outline-none" onClose={toggleNewStatusDialog}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
                  <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                      transition
                      className="w-full max-w-md shadow border-1 rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                      <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                        Enter new status name.
                      </DialogTitle>
                      <form onSubmit={handleSubmit(submitNewStatus)}>
                        <Field>
                          <Input
                            type="text"
                            {...register("status", { required: true })}
                            className={clsx(
                              'mt-3 block w-full rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                            )}
                          />
                          {errors.status && <span className="text-red-400">This field is required</span>}
                        </Field>
                        <div className="mt-4 space-x-3">
                          <Button
                            className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-700 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700 hover:cursor-pointer"
                            type="submit"
                          >
                            Submit
                          </Button>
                          <Button
                            className="inline-flex items-center gap-2 rounded-md bg-red-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700 hover:cursor-pointer"
                            onClick={toggleNewStatusDialog}
                          >
                            Cancle
                          </Button>
                        </div>
                      </form>
                    </DialogPanel>
                  </div>
                </div>
              </Dialog>
            </div>
          </div>

          <div className="flex gap-5 h-full w-full max-w-[74vw] overflow-x-auto">
            {/* column kanban */}
            <SortableContext
              strategy={horizontalListSortingStrategy}
              items={columnIds}>
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  projects={projects.filter(
                    (project) => project.columnId == column.id
                  )}
                  deleteColumn={deleteColumn}
                  deleteProject={deleteProject}
                  setStatus={setStatus}
                />
              ))}
            </SortableContext>

          </div>
        </div>

        <DragOverlay>
          {activeProject && (
            <Card project={activeProject} deleteProject={() => ({})} />
          )}
          {activeColumn && (
            <Column
              id={activeColumn.id}
              title={activeColumn.title}
              projects={projects.filter(
                (project) => project.columnId == activeColumn.id
              )}
              deleteColumn={() => ({})}
              deleteProject={() => ({})}
              setStatus={()=>({})}
            />)
          }
        </DragOverlay>
      </DndContext>
    </div>
  );
}
