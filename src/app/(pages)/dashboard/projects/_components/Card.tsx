"use client"

import { useEffect, useRef, useState } from 'react';
import { Id, Project } from '../type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Menu, MenuButton, MenuItem, MenuItems, Button, Dialog, DialogPanel, DialogTitle, Field, Input } from "@headlessui/react";
import clsx from 'clsx';


interface cardProps {
    project: Project;
    deleteProject: (id: Id) => void;
    setProjectDialog: (params: boolean) => void;
}

export default function Card({ project, deleteProject, setProjectDialog }: cardProps) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isShowDetail, setIsShowDetail] = useState(false);


    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable(
        {
            id: project.id,
            data: {
                type: 'Project',
                project,
            },
            disabled: isProjectDialogOpen
        }
    )

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }


    const toggleEditMode = () => {
        setEditMode(prev => !prev);
    }

    function toggleDetail() {
        setIsShowDetail(prev => !prev)
    }

    function toggleProjectDialog() {
        const toggle = !isProjectDialogOpen
        setIsProjectDialogOpen(toggle)
        setProjectDialog(toggle)
        setIsShowDetail(false)
        setEditMode(false)
    }

    const daysPassed = Math.floor((new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="flex flex-col w-full h-fit min-h-[100px] rounded border-2 border-blue-500 bg-[#F0F6FF]"
            >
            </div>
        )
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            className="bg-white flex flex-col space-y-2 w-full h-fit min-h-[100px] shadow-md rounded px-2 py-1">
            <div onClick={toggleProjectDialog} className="flex justify-between items-center">
                <div className="text-[12px] text-left select-none">{project.title}</div>
                <div className="flex justify-around space-x-5 items-center">
                    <div className=" text-gray-300 text-[12px] flex space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <label className="select-none" htmlFor="day">{daysPassed} days</label>
                    </div>
                    {mouseIsOver && (
                        <div onClick={() => deleteProject(project.id)} className="cursor-pointer opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F7374F" className="size-4">
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            <div onClick={toggleProjectDialog} className="line-clamp-2 text-[12px] text-gray-400 text-left select-none">
                {project.description}
            </div>
            <div className="flex justify-center items-center w-full relative">
                <div className="cursor-pointer rounded-full">
                    <div className="z-10 bg-green-200 hover:bg-green-500 text-green-700 text-[12px] px-2 py-1 rounded-full flex items-center justify-center w-5 h-5 select-none opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out">
                        +
                    </div>
                </div>
                <div className="flex absolute left-1/2 translate-x-5">
                    <div className="w-5 h-5 cursor-pointer overflow-hidden border-white border-1 -ml-2 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                        <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
                    </div>
                    <div className="w-5 h-5 cursor-pointer overflow-hidden border-white border-1 -ml-2 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                        <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
                    </div>
                    <div className="w-5 h-5 cursor-pointer overflow-hidden border-white border-1 -ml-2 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                        <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
                    </div>
                </div>
            </div>

            <Dialog open={isProjectDialogOpen} as="div" className="relative z-10 focus:outline-none" onClose={toggleProjectDialog}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-lg border-1 shadow rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <div className='absolute flex space-x-2 right-5 cursor-pointer'>
                                <div onClick={toggleEditMode}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                                <div onClick={toggleProjectDialog}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                                {project.title}
                            </DialogTitle>
                            <p className={clsx("mt-2 text-sm/6 text-black/50", isShowDetail ? '' : 'line-clamp-3')}>
                                {project.description}
                            </p>
                            {project.description.length >= 280 && (
                                <span onClick={toggleDetail} className='cursor-pointer select-none text-blue-500 text-sm'>
                                    {isShowDetail ? 'Show less' : 'Show more'}
                                </span>
                            )}
                            {editMode && (
                                <div className="mt-4 space-x-3">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-700 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700 hover:cursor-pointer"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-red-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700 hover:cursor-pointer"
                                        onClick={toggleEditMode}
                                    >
                                        Cancle
                                    </Button>
                                </div>
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
