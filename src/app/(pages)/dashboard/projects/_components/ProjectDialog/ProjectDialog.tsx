import React, { useState } from 'react'
import {Dialog, DialogPanel } from "@headlessui/react";
import { Project, Status } from '../../type';
import ProjectDetail from './ProjectDetail';
import ProjectEditDialog from './ProjectEditDialog';


interface props {
    project: Project;
    status: Status[];
    type: string[];
    isProjectDialogOpen: boolean;
    toggleProjectDialog: () => void;
    toggleMemberDialog: () => void;
    setActiveProject: (project: Project | null) => void;
}

function ProjectDialog({ project, status, type, isProjectDialogOpen, toggleMemberDialog, toggleProjectDialog, setActiveProject }: props) {

    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode(prev => !prev);
    }

    function toggleDialog() {
        toggleProjectDialog()
        setEditMode(false)
    }

    function closeDialog() {
        setActiveProject(null)
        toggleDialog()
    }

    return (
        <Dialog open={isProjectDialogOpen} as="div" className="z-10 focus:outline-none" onClose={closeDialog}>
            <div className='fixed inset-0 z-0 w-screen h-screen backdrop-blur-xs' />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="relative w-full max-w-3xl border-1 shadow rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <div className='absolute flex space-x-2 right-5 cursor-pointer'>
                            {!editMode && (
                                <div onClick={toggleEditMode}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                            )}
                            <div onClick={closeDialog}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        {!editMode ? (
                           <ProjectDetail project={project} status={status}/>
                        ) : (
                            <ProjectEditDialog project={project} status={status} type={type} toggleMemberDialog={toggleMemberDialog} toggleEditMode={toggleEditMode}/>
                        )}
                    </DialogPanel>
                </div>
            </div>
            
        </Dialog>
    )
}

export default ProjectDialog