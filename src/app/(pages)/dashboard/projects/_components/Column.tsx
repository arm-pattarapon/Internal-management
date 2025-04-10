"use client"

import { SortableContext } from "@dnd-kit/sortable";
import { Id, Project } from "../type";
import Card from "./Card";
import { useMemo } from "react";

interface Column {
    id: number;
    title: string;
    deleteProject: (id: Id) => void;
    projects: Project[];
}

export default function Column({projects, deleteProject, ...column}: Column) {
    const projectIds = useMemo(() => {
        return projects.map(project=> project.id)
    },[projects])

    return (
        <div key={column.id} className="bg-white rounded-sm shadow-lg w-full flex flex-col border-1 border-gray-300">
            <div className=" bg-[#F0F6FF] w-full h-10 rounded-t-sm px-2 flex items-center justify-between">
                <div className="text-md text-left select-none">{column.title}</div>
                <div className="text-[12px] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
            </div>
            <div className="flex flex-col flex-grow space-y-3 p-3 overflow-y-auto max-h-100">
                {/* Card */}
                <SortableContext items={projectIds}>
                    {projects.map((project: any) => (
                        <Card key={project.id} project={project} deleteProject={deleteProject} />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}

