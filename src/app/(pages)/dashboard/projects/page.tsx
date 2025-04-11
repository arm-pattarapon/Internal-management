"use client"

import { useEffect, useState } from "react";
import Column from "./_components/Column";
import { Id, Project } from "./type"
import Link from "next/link";

interface Column {
    id: string;
    title: string;
}

import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, pointerWithin, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import Card from "./_components/Card";

export default function projectsPage() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const [activeProject, setActiveProject] = useState<Project | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor,{
            activationConstraint: {
                distance: 3,
            },
        })
    )

    function deleteProject(id: Id) {
        const newProjects = projects.filter((project) => project.id !== id)
        setProjects(newProjects)
    }

    function onDragStart(event: DragStartEvent) {
        if(event.active.data.current?.type === 'Project') {
            setActiveProject(event.active.data.current?.project);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent){
        const {active, over} = event;
        console.log('project after move: ',projects);
        if(!over) return;

        const activeId = active.id;
        const overId = over.id;

        if( activeId === overId) return;

        setProjects((projects) => {
            const activeIndex = projects.findIndex((project) => project.id === activeId);
            const overIndex = projects.findIndex((project) => project.id === overId);

            return arrayMove(projects,activeIndex,overIndex);
        })
    }

    function onDragOver(event: DragOverEvent) {
        const {active, over} = event;
        if(!over) return;
        console.log('drag over: ',over, 'active: ', active);

        const activeId = active.id;
        const overId = over.id;

        if( activeId === overId) return;

        const isActive = active.data.current?.type === 'Project';
        const isOver = over.data.current?.type === 'Project';

        if(!isActive) return;
        
        if (!(isActive && isOver)) {
            const activeProjectColumnId = active.data.current?.project.columnId;
            const overColumnId = over.data.current?.column.id;
       
            setProjects((projects) => {
                if(activeProjectColumnId === overColumnId) return projects;
                const activeProject = projects.find((project) => project.id === activeId);
                const newProject = projects.map((project) => {
                    if(project.id === activeProject?.id){
                        return {
                            ...project,
                            columnId: overColumnId,
                        }
                    }
                    return project;
                })
                
                return newProject
            })

        }else{
            const activeProjectColumnId = active.data.current?.project.columnId;
            const overProjectColumnId = over.data.current?.project.columnId;
            if(activeProjectColumnId === overProjectColumnId) return;
            setProjects((projects) => {
                const activeProject = projects.find((project) => project.id === activeId);
                const newProject = projects.map((project) => {
                    if(project.id === activeProject?.id){
                        return {
                            ...project,
                            columnId: overProjectColumnId,
                        }
                    }
                    return project;
                })
                
                return newProject
            })

        }
    }




    useEffect(() => {
        setColumns([
            { id: `columnId-1`, title: "Backlog" },
            { id: `columnId-2`, title: "In Progress" },
            { id: `columnId-3`, title: "Completed" },
        ])

        setProjects([
            { id: 1, columnId: `columnId-1`, title: "Project Alpha", description: "Initial project setup", createdAt: new Date("2023-01-01"), updatedAt: new Date("2023-01-02") },
            { id: 2, columnId: `columnId-1`, title: "Project Beta", description: "Research and development", createdAt: new Date("2023-02-01"), updatedAt: new Date("2023-02-05") },
            { id: 5, columnId: `columnId-1`, title: "Project Epsilon", description: "Requirement gathering", createdAt: new Date("2023-05-01"), updatedAt: new Date("2023-05-03") },
        ])
        
    }, [])

    return (
        <div className="bg-white rounded shadow-sm p-5 w-full h-full">
            <DndContext 
                sensors={sensors} 
                onDragStart={onDragStart} 
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                collisionDetection={pointerWithin}
                
            >
                <div className="flex flex-col h-full">
                    <div className="text-[24px] text-left ">
                        Overview
                    </div>
                    <div className="text-left text-[12px] text-gray-400">Edit or modify all card as you want</div>
                    <hr className="border-1 rounded text-gray-300 mt-5 mb-3" />
                    
                        <div className="grid grid-cols-3 gap-5 mb-3 ">
                            <div>
                                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-3.5 h-3.5 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input type="search" id="default-search" className="block w-full ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F0F6FF] focus:ring-blue-500 focus:border-blue-500 " placeholder="Search Projects" />
                                </div>
                            </div>
                            <div className="col-span-2 flex space-x-5">
                                <div className="w-50">
                                    <label htmlFor="datepick" className="mb-2 text-sm font-medium text-gray-900 sr-only">Date</label>
                                    <div className="relative">
                                        <input type="date" id="datepick" className="block w-full py-2 px-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F0F6FF] focus:ring-blue-500 focus:border-blue-500 " />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Link href="./projects/newproject" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3.5 rounded">
                                        + Project
                                    </Link>
                                </div>

                            </div>

                        </div>
                        
                        <div className="flex gap-5 h-full overflow-x-hidden">
                            {/* column kanban */}
                            {columns.map((column) => (
                                <Column 
                                    key={column.id} 
                                    id={column.id} 
                                    title={column.title} 
                                    projects={projects.filter(project => project.columnId == column.id)} 
                                    deleteProject={()=>({})}
                                />
                            ))}
                        </div>
                </div>
                  
                <DragOverlay>
                    {activeProject && (
                        <Card project={activeProject} deleteProject={deleteProject} />
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    )
}