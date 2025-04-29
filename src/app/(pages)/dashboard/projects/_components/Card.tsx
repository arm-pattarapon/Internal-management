/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { Project, Status } from "../type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface cardProps {
  project: Project;
  deleteProject: (id: string) => void;
  setActiveProject: (project: Project) => void;
  toggleProjectMemberDialog: () => void;
  toggleProjectDialog: () => void;
}

export default function Card({
  project,
  setActiveProject,
  toggleProjectMemberDialog,
  toggleProjectDialog,
  deleteProject,
}: cardProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project._id,
    data: {
      type: "Project",
      project,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function toggleDialog() {
    setActiveProject(project);
    toggleProjectDialog();
  }

  function toggleMemberDialog(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setActiveProject(project);
    toggleProjectMemberDialog();
  }

  const daysPassed = Math.floor(
    (new Date().getTime() - new Date(project.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col w-full h-fit min-h-[100px] rounded border-2 border-blue-500 bg-[#F0F6FF]"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleDialog}
      className="bg-white flex flex-col space-y-2 w-full h-fit min-h-[100px] shadow-md rounded px-2 py-1 relative"
    >
      <div className="flex justify-between items-center">
        <div className="text-[12px] text-left select-none">{project.name}</div>
        <div className="flex justify-around space-x-5 items-center">
          <div className=" text-gray-300 text-[12px] flex space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <label className="select-none" htmlFor="day">
              {daysPassed} days
            </label>
          </div>
          {mouseIsOver && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                deleteProject(project._id)
              }}
              className="cursor-pointer opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#F7374F"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className="line-clamp-2 text-[12px] text-gray-400 text-left select-none">
        {project.description}
      </div>
      <div className="absolute left-1/2 bottom-3 -translate-x-3">
        <div className="flex justify-center items-center w-full relative">
          <div
            onClick={(e) => toggleMemberDialog(e)}
            className="cursor-pointer rounded-full"
          >
            <div className="z-10 bg-green-200 hover:bg-green-500 text-green-700 text-[12px] px-2 py-1 rounded-full flex items-center justify-center w-5 h-5 select-none opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out">
              +
            </div>
          </div>
          <div className="flex absolute left-1/2 translate-x-5">
            {project.users.slice(0, 3).map((user, index) => (
              <div
                key={index}
                className="w-5 h-5 cursor-pointer overflow-hidden border-white border-1 -ml-2 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm"
              >
                <img
                  className="object-cover select-none"
                  src="/default_user_logo.png"
                  alt="user_logo"
                />
              </div>
            ))}

            {project.users.length > 3 && (
              <div className="z-10 bg-green-400 text-green-700 text-[12px] px-2 py-1 -ml-2 rounded-full flex items-center justify-center w-5 h-5 select-none hover:opacity-100 transition-all duration-200 ease-in-out">
                +{project.users.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
