import React, { useState } from 'react'
import {Button, Field, Input, Label, Select, Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Textarea, Fieldset, Legend } from "@headlessui/react";
import clsx from 'clsx';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Project, Status } from '../../type';
import { useForm } from 'react-hook-form';

interface props {
    project: Project;
    status: Status[];
    type: string[];
    toggleMemberDialog: () => void;
    toggleEditMode: () => void;
}

type Inputs = {
    _id: string,
    status: string,
    type: string,
    description: string,
    note: string,
    projectManager: string,
    businessanalystLead: string,
    developerLead: string
}

function ProjectEditDialog({project, status, type, toggleMemberDialog, toggleEditMode}:props) {
    const [queryType, setQueryType] = useState('')
    const [selectedStatus, setSelectedStatus] = useState<Status>(status.find(s => s._id === project.statusId) || status[0])
    const [selectedType, setSelectedType] = useState<string | null>(project.type)

  

    const filteredType =
        queryType === ''
            ? type
            : type.filter((t) => {
                return t.toLowerCase().includes(queryType.toLowerCase())
            })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();



    return (
        <form>
            <Fieldset className='flex flex-col space-y-3'>
                <Legend className="text-lg font-bold">Project details</Legend>
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Project Name</Label>
                    <Input
                        className={clsx(
                            'block w-full rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        placeholder={project.name}
                        defaultValue={project.name}
                    />
                </Field>
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Project Status</Label>
                    <div className="relative">
                        <Select
                            className={clsx(
                                'block w-full appearance-none rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                            )}
                            value={selectedStatus._id}
                            onChange={(e) => {
                                const selectedStatus = e.target.value;
                                const newSelectedStatus = status.find(s => s._id === selectedStatus)
                                setSelectedStatus(newSelectedStatus || status[0])
                            }}
                        >
                            {status.map((status, index) => (
                                <option
                                    key={index}
                                    value={status._id}
                                >{status.title}</option>
                            ))}
                        </Select>
                        <ChevronDownIcon
                            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                            aria-hidden="true"
                        />
                    </div>
                </Field>
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Project Type</Label>
                    <Combobox value={selectedType} onChange={(value) => setSelectedType(value)} onClose={() => setQueryType('')}>
                        <div className="relative">
                            <ComboboxInput
                                className={clsx(
                                    'w-full rounded-lg border-1 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                )}
                                displayValue={() => selectedType || ''}
                                onChange={(event) => {
                                    setQueryType(event.target.value);
                                    setSelectedType(event.target.value);
                                }}
                            />
                            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                            </ComboboxButton>
                        </div>

                        <ComboboxOptions
                            anchor="bottom"
                            transition
                            className={clsx(
                                'w-[var(--input-width)] rounded-xl border-1 shadow bg-white backdrop-blur-2xl z-10 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                                'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                            )}
                        >
                            {filteredType.map((type, index) => (
                                <ComboboxOption
                                    key={index}
                                    value={type}
                                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                                >
                                    <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                                    <div className="text-sm/6 text-black">{type}</div>
                                </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                    </Combobox>
                </Field>
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Description</Label>
                    <Textarea
                        className={clsx(
                            'block w-full resize-y rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        rows={5}
                        defaultValue={project.description}
                        placeholder={project.description}
                    />
                </Field>
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Note</Label>
                    <Textarea
                        className={clsx(
                            'block w-full resize-y rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        rows={5}
                        defaultValue={project.note}
                        placeholder={project.note}
                    />
                </Field>
                <div className='grid grid-cols-3 gap-1 mt-3'>
                    <Field className='flex flex-col items-center text-center'>
                        <Label className="text-sm/6 font-medium text-black">Project Lead</Label>
                        <div className='w-10 h-10 rounded-full overflow-hidden'>
                            <img className='object-cover' src="/default_user_logo.png" alt="user_picture" />
                        </div>
                        <div className='text-xs'>{project.projectManager.name}</div>
                    </Field>
                    <Field className='flex flex-col items-center text-center'>
                        <Label className="text-sm/6 font-medium text-black">Business Analyst Lead</Label>
                        <div className='w-10 h-10 rounded-full overflow-hidden'>
                            <img className='object-cover' src="/default_user_logo.png" alt="user_picture" />
                        </div>
                        <div className='text-xs'>{project.businessanalystLead.name}</div>
                    </Field>
                    <Field className='flex flex-col items-center text-center'>
                        <Label className="text-sm/6 font-medium text-black">Developer Lead</Label>
                        <div className='w-10 h-10 rounded-full overflow-hidden'>
                            <img className='object-cover' src="/default_user_logo.png" alt="user_picture" />
                        </div>
                        <div className='text-xs'>{project.developerLead.name}</div>
                    </Field>
                </div>
                <Field>
                    <Label className="text-sm/6 font-medium text-black relative">Member
                        <div onClick={toggleMemberDialog} className="cursor-pointer rounded-full absolute -top-0.5 -right-6">
                            <div className="z-10 bg-green-200 hover:bg-green-500 text-green-700 text-[12px] px-2 py-1 rounded-full flex items-center justify-center w-5 h-5 select-none opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out">
                                +
                            </div>
                        </div>
                    </Label>
                    {project.users.map((user, index) => (
                        <div key={index} className='flex justify-between'>
                            <div className='flex'>
                                <div className='w-10 h-10 rounded-full overflow-hidden'>
                                    <img className='object-cover' src="/default_user_logo.png" alt="user_picture" />
                                </div>
                                <div className='flex flex-col justify-center'>
                                    <div className='text-xs'>{user.name}</div>
                                    <div className='text-xs text-black/50'>{user.role}</div>
                                </div>
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </Field>
            </Fieldset>
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
        </form>
    )
}

export default ProjectEditDialog