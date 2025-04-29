/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect,  useState } from "react";
import Column from "./_components/Column";
import { Project, Status, Users } from "./type";
import Link from "next/link";
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
import Card from "./_components/Card";

import {
  deleteProjectById,
  getAllUsers,
  getCardData,
  getStatusData,
  updateProjectStatus,
  updateStatus,
} from "./Api";

import ProjectDialog from "./_components/ProjectDialog/ProjectDialog";
import MemberDialog from "./_components/MemberDialog";
import SearchBox from "./_components/SearchBox";
import StatusDialog from "./_components/StatusDialog";
import Spinner from "@/app/component/spiner";

export default function projectsPage() {
  const [isLoad, setIsLoad] = useState(true)
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Status[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);


  function toggleStatusDialog() {
    setIsStatusDialogOpen(!isStatusDialogOpen);
  }

  function toggleProjectDialog() {
    setIsProjectDialogOpen((prev) => !prev);
  }

  function toggleMemberDialog() {
    setIsMemberDialogOpen((prev) => !prev);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function deleteProject(id: string) {
    const confirmToDel = confirm('sure?')
    if(!confirmToDel) return;
    try {      
      const newProjects = projects.filter((project) => project._id !== id);
      deleteProjectById(id)
      setProjects(newProjects);
    } catch (error) {
      throw new Error('error delete project')
    }
  }

  function setStatus(id: string, status: string) {
    setColumns((columns) =>
      columns.map((column) =>
        column._id === id ? { ...column, title: status } : column
      )
    );
    updateStatus(id, status);
  }

  function setNewProject(newProject:any){
    setProjects((projects)=>
      projects.map((project)=>
        project._id === newProject._id ? {...project ,...newProject} :project
      )
    )
  }

  function onDragStart(event: DragStartEvent) {
    console.log("draging :", event.active);
    document.body.style.setProperty("cursor", "grabbing", "important");
    const type = event.active.data.current?.type;

    if (type === "Project") {
      setActiveProject(event.active.data.current?.project);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    document.body.style.cursor = "default";
    const { active, over } = event;
    // console.log("project after move: ", projects);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    console.log('dragEnd :',active,' over: ',over);
    // (id ของการ์ดใบที่กำลังลาก, id ของ status ** อาจจะลากไว้บนบางโปรเจค หรือ บน คอลั่มได้)
    updateProjectStatus(String(activeId), over.data.current?.project?.statusId || overId);

    setActiveProject(null);
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
    const overstatusId =
      over.data.current?.column?._id || over.data.current?.project?.statusId;

    if (activeProjectstatusId === overstatusId) return;

    setProjects((projects) => {
      const activeProjectIndex = projects.findIndex(
        (project) => project._id === activeId
      );
      if (activeProjectIndex === -1) return projects;

      const updatedProjects = [...projects];
      updatedProjects[activeProjectIndex] = {
        ...updatedProjects[activeProjectIndex],
        statusId: overstatusId,
      };

      return updatedProjects;
    });
    console.log("activeProjectId: ", activeId, "overstatusId: ", overstatusId);

    
  }

  useEffect(() => {
    
    async function fetchInitialData() {
      try {
        setIsLoad(true)
        const [status, card, users] = await Promise.all([
          getStatusData(),
          getCardData(),
          getAllUsers()
        ]);
        setColumns(status);
        setProjects(card);
        setUsers(users)
        const projectType = Array.from(new Set(card.map(({ type }) => type)));
        setProjectTypes(projectType);
        setIsLoad(false)
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }

    fetchInitialData();
  }, []);

  return (
    <div className="relative bg-white rounded shadow-sm p-5 w-full h-full overflow-hidden">
      {isLoad && <Spinner />}

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
            <SearchBox placeholder="Search Projects" />
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
              <div
                onClick={() => toggleStatusDialog()}
                className="inline-flex items-center gap-2 rounded-md bg-blue-400 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-blue-700 focus:outline-1 focus:outline-white open:bg-gray-700 hover:cursor-pointer"
              >
                + Status
              </div>
            </div>
          </div>
          
          <div className="flex gap-5 h-full w-full max-w-[80vw] min-w-0 overflow-x-auto">
            {/* column kanban */}
            {columns.map((column) => (
              <div key={column._id} className="flex-shrink-0">
                <Column
                  _id={column._id}
                  title={column.title}
                  projects={projects.filter(
                    (project) => project.statusId == column._id
                  )}
                  deleteProject={deleteProject}
                  setStatus={setStatus}
                  setActiveProject={setActiveProject}
                  toggleProjectDialog={toggleProjectDialog}
                  toggleMemberDialog={toggleMemberDialog}
                  toggleStatusDialog={toggleStatusDialog}
                />
              </div>
            ))}
          
          </div>
            
         

        </div>

        <DragOverlay>
          {activeProject && (
            <Card
              project={activeProject}
              deleteProject={() => ({})}
              setActiveProject={()=>({})}
              toggleProjectMemberDialog={()=>({})}
              toggleProjectDialog={() => ({})}
            />
          )}
        </DragOverlay>
      </DndContext>

      {activeProject && isProjectDialogOpen && (
        <ProjectDialog
          project={activeProject}
          users={users}
          status={columns}
          type={projectTypes}
          isProjectDialogOpen={isProjectDialogOpen}
          toggleProjectDialog={toggleProjectDialog}
          toggleMemberDialog={toggleMemberDialog}
          setActiveProject={setActiveProject}
        />
      )}

      <MemberDialog
        projectMember={activeProject?.users}
        isOpen={isMemberDialogOpen}
        toggleMemberDialog={toggleMemberDialog}
      />
      <StatusDialog
        isDialogOpen={isStatusDialogOpen}
        setColumns={setColumns}
        toggleStatusDialog={toggleStatusDialog}
      />
    </div>
  );
}
