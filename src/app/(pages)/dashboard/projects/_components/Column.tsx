/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Project, Status } from "../type";
import Card from "./Card";
import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";

interface Column {
  _id: string;
  title: string;
  deleteProject: (id: string) => void;
  setStatus: (id: string, status: string) => void;
  setActiveProject: (project: Project) => void;
  toggleMemberDialog: () => void;
  toggleProjectDialog: () => void;
  toggleStatusDialog: (action: string, status: Status | null) => void;
  projects: Project[];
}

export default function Column({
  projects,
  deleteProject,
  setStatus,
  setActiveProject,
  toggleMemberDialog,
  toggleProjectDialog,
  toggleStatusDialog,
  ...column
}: Column) {
  const projectIds = useMemo(() => {
    return projects.map((project) => project._id);
  }, [projects]);

  const [mouseIsOver, setMouseIsOver] = useState(false);


  const {
    setNodeRef
  } = useDroppable({
    id: column._id,
    data: {
      type: "Column",
      column,
    },
  });


  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-white rounded-sm shadow-lg w-full flex flex-col border-1 border-gray-300 min-w-80 max-w-80"
    >
      <div className=" bg-[#F0F6FF] w-full h-10 rounded-t-sm px-2 flex items-center justify-between">
        <div className="text-md text-left truncate select-none">
          {column.title}
        </div>
        {/* {mouseIsOver && (
          <Menu as="div" className="relative">
            <MenuButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 hover:cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </MenuButton>
            <MenuItems
              aria-labelledby="StatusAction"
              className="absolute z-10 origin-top-right w-20 right-0 bg-white border-1 shadow-2xl rounded-sm text-center select-none hover:cursor-pointer"
            >
              <MenuItem
                as="div"
                onClick={() => toggleStatusDialog("Update", column)}
                className=" hover:bg-blue-500 rounded-t-sm"
              >
                Edit
              </MenuItem>
              <MenuItem
                as="div"
                onClick={() => deleteColumn(column._id)}
                className="hover:bg-red-400 rounded-b-sm"
              >
                Delete
              </MenuItem>
            </MenuItems>
          </Menu>
        )} */}
      </div>
      <div className="flex flex-col flex-grow space-y-3 p-3 overflow-y-auto max-h-100">
        {/* Card */}
        <SortableContext
          id={column._id}
          strategy={verticalListSortingStrategy}
          items={projectIds}
        >
          {projects.map((project: any) => (
            <Card
              key={project._id}
              project={project}
              deleteProject={deleteProject}
              toggleProjectDialog={toggleProjectDialog}
              toggleProjectMemberDialog={toggleMemberDialog}
              setActiveProject={setActiveProject}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
