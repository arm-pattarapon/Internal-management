"use client";

import { useEffect, useMemo, useState } from "react";
import Column from "./_components/Column";
import { Project, Status } from "./type";
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
import { createStatus, deleteStatus, getCardData, getStatusData, updateProjectStatus, updateStatus } from "./Api";
import ProjectDialog from "./_components/ProjectDialog";
import MemberDialog from "./_components/MemberDialog";
import SearchBox from "./_components/SearchBox";


type Inputs = {
  status: string
}

export default function projectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Status[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeColumn, setActiveColumn] = useState<Status | null>(null);
  const [projectTypes , setProjectTypes] = useState<string[]>([])

  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isNewStatusDialogOpen, setIsNewStatusDialogOpen] = useState(false)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  
  const statusIds = useMemo(() => {
    return columns.map(columns => columns._id)
  }, [columns])

  function toggleNewStatusDialog() {
    setIsNewStatusDialogOpen(!isNewStatusDialogOpen)
    reset();
  }

  function toggleProjectDialog(){
    setIsProjectDialogOpen(prev => !prev)
  }

  function toggleMemberDialog() {
    setIsMemberDialogOpen(prev=>!prev)
}

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const submitNewStatus: SubmitHandler<Inputs> = async ({ status }) => {
    const newStatus = await createStatus(status);
    if(!newStatus) return;
    const {data} = newStatus;

    setColumns((column) => {
      const newColumn = {
        _id: data._id,
        title: status,
      }
      return [...column, newColumn]
    })
    toggleNewStatusDialog();
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function deleteProject(id: string) {
    const newProjects = projects.filter((project) => project._id !== id);
    setProjects(newProjects);
  }

  function deleteColumn(id: string) {
    const newColumn = columns.filter((column) => column._id !== id)
    setColumns(newColumn)
    deleteStatus(id)
  }

  function setStatus(id: string, status: string) {
    setColumns((columns) =>
      columns.map((column) =>
        column._id === id ? { ...column, title: status } : column
      )
    );
    updateStatus(id,status);
  }

  function onDragStart(event: DragStartEvent) {
    setActiveColumn(null)
    setActiveProject(null)
    console.log("draging :", event.active);
    document.body.style.setProperty('cursor', 'grabbing', 'important');
    const type = event.active.data.current?.type

    if (type === "Project") {
      setActiveProject(event.active.data.current?.project);
    } else if (type === "Column") {
      setActiveColumn(event.active.data.current?.column);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    document.body.style.cursor = 'default';
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
          (column) => column._id === activeId
        );
        const overIndex = columns.findIndex((column) => column._id === overId);

        return arrayMove(columns, activeIndex, overIndex);
      });
    }
    setActiveColumn(null)
    setActiveProject(null)
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isProjectActive = active.data.current?.type === "Project";

    if (!isProjectActive) return;

    const activeProjectstatusId = active.data.current?.project.statusId;
    const overstatusId = over.data.current?.column?._id || over.data.current?.project?.statusId;

    if (activeProjectstatusId === overstatusId) return;

    setProjects((projects) => {
      const activeProjectIndex = projects.findIndex((project) => project._id === activeId);
      if (activeProjectIndex === -1) return projects;

      const updatedProjects = [...projects];
      updatedProjects[activeProjectIndex] = {
        ...updatedProjects[activeProjectIndex],
        statusId: overstatusId,
      };

      return updatedProjects;
    });
    console.log('activeProjectId: ',activeId ,'overstatusId: ',overstatusId);
    
    updateProjectStatus(String(activeId),overstatusId);
  }

  useEffect(() => {
      async function fetchInitialData() {
        try {
          const [status, card] = await Promise.all([getStatusData(), getCardData()]);
          setColumns(status);
          setProjects(card);
          const projectType = card.map(({ type }) => type);
          setProjectTypes(projectType);
          console.log('project types:', projectTypes);
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      }

      fetchInitialData();

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
            <SearchBox placeholder="Search Projects"/>
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
                className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-blue-700 focus:outline-1 focus:outline-white open:bg-gray-700 hover:cursor-pointer"
              >
                + Project
              </Link>
              <div onClick={toggleNewStatusDialog}
                className="inline-flex items-center gap-2 rounded-md bg-blue-400 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-blue-700 focus:outline-1 focus:outline-white open:bg-gray-700 hover:cursor-pointer"
              >
                + Status
              </div>
              <Dialog open={isNewStatusDialogOpen} as="div" className="relative z-10 focus:outline-none" onClose={toggleNewStatusDialog}>
                <div className='fixed inset-0 z-0 w-screen h-screen backdrop-blur-xs' />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
                  <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                      transition
                      className="w-full max-w-md shadow border-1 rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
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
              items={statusIds}>
              {columns.map((column) => (
                <Column
                  key={column._id}
                  _id={column._id}
                  title={column.title}
                  projects={projects.filter(
                    (project) => project.statusId == column._id
                  )}
                  deleteColumn={deleteColumn}
                  deleteProject={deleteProject}
                  setStatus={setStatus}
                  setActiveProject={setActiveProject}
                  toggleProjectDialog={toggleProjectDialog}
                  toggleMemberDialog={toggleMemberDialog}
                />
              ))}
            </SortableContext>

          </div>
        </div>

        <DragOverlay>
          {activeProject && (
            <Card
              project={activeProject}
              deleteProject={() => ({})}
              setActiveProject={setActiveProject}
              toggleProjectMemberDialog={toggleMemberDialog}
              toggleProjectDialog={()=>({})}
            />
          )}
          {activeColumn && (
            <Column
              _id={activeColumn._id}
              title={activeColumn.title}
              projects={projects.filter(
                (project) => project.statusId == activeColumn._id
              )}
              deleteColumn={() => ({})}
              deleteProject={() => ({})}
              setStatus={() => ({})}
              setActiveProject={()=> ({})}
              toggleProjectDialog={()=>({})}
              toggleMemberDialog={()=>({})}
            />)
          }
        </DragOverlay>
      </DndContext>
      

      {activeProject && isProjectDialogOpen && (
        <ProjectDialog 
          project={activeProject} 
          status={columns}
          type={projectTypes}
          isProjectDialogOpen={isProjectDialogOpen} 
          toggleProjectDialog={toggleProjectDialog} 
          toggleMemberDialog={toggleMemberDialog}
          setActiveProject={setActiveProject} />
      )}
      
      <MemberDialog projectMember={activeProject?.users} isOpen={isMemberDialogOpen} toggleMemberDialog={toggleMemberDialog}/>
    </div>
  );
}

