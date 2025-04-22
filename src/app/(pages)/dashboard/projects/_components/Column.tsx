"use client"

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Project } from "../type";
import Card from "./Card";
import { useMemo, useState } from "react";
import { CSS } from '@dnd-kit/utilities';
import { Menu, MenuButton, MenuItem, MenuItems, Button, Dialog, DialogPanel, DialogTitle, Field, Input } from "@headlessui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";

interface Column {
    _id: string;
    title: string;
    deleteProject: (id: string) => void;
    deleteColumn: (id: string) => void;
    setStatus:(id: string, status:string)=> void;
    projects: Project[];

}

type Inputs = {
    _id: string,
    status: string
}

export default function Column({ projects, deleteProject, deleteColumn, setStatus, ...column }: Column) {
    const projectIds = useMemo(() => {
        return projects.map(project => project._id)
    }, [projects])
    const [mouseIsOver, setMouseIsOver] = useState(false);
    
    const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

    function setProjectDialog(params:boolean) {
        setIsProjectDialogOpen(params)
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable(
        {
            id: column._id,
            data: {
                type: 'Column',
                column,
            },
            disabled:isEditStatusDialogOpen || isProjectDialogOpen
        }
    )

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

   

    function toggleNewStatusDialog() {
        setIsEditStatusDialogOpen(!isEditStatusDialogOpen)
    }

    const submitNewStatus: SubmitHandler<Inputs> = async (data) =>{
        const {status, _id} = data
        setStatus(_id,status)
        toggleNewStatusDialog()
        reset()   
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="flex flex-col w-full h-full min-h-[100px] rounded border-2 border-blue-500 bg-[#F0F6FF] min-w-80 max-w-80"
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
            className="bg-white rounded-sm shadow-lg w-full flex flex-col border-1 border-gray-300 min-w-80 max-w-80">
            <div className=" bg-[#F0F6FF] w-full h-10 rounded-t-sm px-2 flex items-center justify-between">
                <div className="text-md text-left truncate select-none">{column.title}</div>
                {mouseIsOver && (
                    <Menu as="div" className="relative">
                        <MenuButton>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </MenuButton>
                        <MenuItems aria-labelledby="StatusAction" className="absolute origin-top-right w-20 right-0 bg-white border-1 shadow-2xl rounded-sm text-center select-none hover:cursor-pointer">
                            <MenuItem as="div" onClick={toggleNewStatusDialog} className=" hover:bg-blue-500 rounded-t-sm">
                                Edit
                            </MenuItem>
                            <MenuItem as="div" onClick={() => deleteColumn(column._id)} className="hover:bg-red-400 rounded-b-sm">
                                Delete
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                )}
            </div>
            <Dialog open={isEditStatusDialogOpen} as="div" className="relative z-10 focus:outline-none" onClose={toggleNewStatusDialog}>
                <div className='fixed inset-0 z-0 w-screen h-screen backdrop-blur-xs'/>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                                        defaultValue={column.title}
                                        placeholder={column.title}
                                        type="text"
                                        {...register("status", { required: true })}
                                        className={clsx(
                                            'mt-3 block w-full rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                        )}
                                    />
                                    <Input
                                        defaultValue={column._id}
                                        disabled
                                        hidden
                                        {...register("_id",{required: true})}
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
            <div className="flex flex-col flex-grow space-y-3 p-3 overflow-y-auto max-h-100">
                {/* Card */}
                <SortableContext
                    id={column._id}
                    strategy={verticalListSortingStrategy}
                    items={projectIds}>
                    {projects.map((project: any) => (
                        <Card 
                        key={project._id} 
                        project={project}
                        status={column}
                        deleteProject={deleteProject}
                        setProjectDialog={setProjectDialog} />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}

