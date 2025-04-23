import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Button, Dialog, DialogPanel, DialogTitle, Field, Input, Label, Select, Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Textarea, Fieldset, Legend } from "@headlessui/react";
import { Project, Status } from '../type';
import clsx from 'clsx';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

interface props {
    project: Project;
    status: Status[];
    isProjectDialogOpen: boolean;
    toggleProjectDialog: () => void;
}

const people = [
    { id: '1', title: 'Tom Cook' },
    { id: '2', title: 'Wade Cooper' },
    { id: '3', title: 'Tanya Fox' },
    { id: '4', title: 'Arlene Mccoy' },
    { id: '5', title: 'Devon Webb' },
]

function ProjectDialog({ project, status, isProjectDialogOpen, toggleProjectDialog }: props) {
    const [isShowDetail, setIsShowDetail] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const descriptionOverflow = project ? project.description.length >= 200 : false;

    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<Status | null>(null)

    const filteredPeople =
        query === ''
            ? people
            : people.filter((person) => {
                return person.title.toLowerCase().includes(query.toLowerCase())
            })

    const toggleEditMode = () => {
        setEditMode(prev => !prev);
    }

    function toggleDetail() {
        setIsShowDetail(prev => !prev)
    }

    function toggleDialog(){
        toggleProjectDialog()
        setEditMode(false)
    }

    return (
        <Dialog open={isProjectDialogOpen} as="div" className="z-10 focus:outline-none" onClose={toggleDialog}>
            <div className='fixed inset-0 z-0 w-screen h-screen backdrop-blur-xs' />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="relative w-full max-w-lg border-1 shadow rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <div className='absolute flex space-x-2 right-5 cursor-pointer'>
                            {!editMode && (
                                <div onClick={toggleEditMode}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                            )}
                            <div onClick={toggleDialog}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        {!editMode ? (
                            <>
                                <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                                    <div>{project.name}<span className='text-black/50 text-xs align-middle'> {status.find(s => s._id === project.statusId)?.title || ''}</span></div>
                                    <div className='text-black/80 text-xs'>{project.type}</div>
                                </DialogTitle>
                                <p className={clsx("mt-2 text-sm/6 text-black/50")}>
                                    {isShowDetail || !descriptionOverflow
                                        ? project.description
                                        : `${project.description.substring(0, 200)} . . .`}
                                </p>
                                {descriptionOverflow && (
                                    <span onClick={toggleDetail} className='cursor-pointer select-none text-blue-500 text-sm'>
                                        {isShowDetail ? 'Show less' : 'Show more'}
                                    </span>
                                )}
                                <div className='grid grid-cols-3 mt-3 justify-center'>
                                    <div className='flex flex-col space-y-1 items-center'>
                                        <div className='text-sm'>Project Lead</div>
                                        <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                            <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
                                        </div>
                                        <div className='text-xs'>{project.projectManager.name}</div>
                                    </div>
                                    <div className='flex flex-col space-y-1 items-center'>
                                        <div className='text-sm'>Business Analyst Lead</div>
                                        <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                            <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
                                        </div>
                                        <div className='text-xs'>{project.businessanalystLead.name}</div>
                                    </div>
                                    <div className='flex flex-col space-y-1 items-center'>
                                        <div className='text-sm'>Developer Lead</div>
                                        <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                            <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
                                        </div>
                                        <div className='text-xs'>{project.developerLead.name}</div>
                                    </div>
                                </div>
                                <p className='text-sm text-center my-3'>Member</p>
                                <div className='flex flex-wrap justify-around space-x-3 space-y-2'>
                                    {project.users.map((user, index) => (
                                        <div key={index} className='flex flex-col space-y-1 items-center'>
                                            <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                                <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
                                            </div>
                                            <div className='text-xs'>{user.name}</div>
                                            <div className='text-xs text-black/50'>({user.role})</div>
                                        </div>
                                    ))}

                                </div>
                                <div className='flex justify-evenly mt-3'>
                                    <div className='flex flex-col items-center'>
                                        <div className='text-xs'>Start Date</div>
                                        <div className='text-xs text-black/50'>1/1/2564</div>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='text-xs'>Due Date</div>
                                        <div className='text-xs text-black/50'>1/1/2564</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form>
                                <Fieldset>
                                    <Legend className="text-lg font-bold">Project details</Legend>
                                    <Field>
                                        <Label className="text-sm/6 font-medium text-black">Project Name</Label>
                                        <Input
                                            className={clsx(
                                                'mt-3 block w-full rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
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
                                                    'mt-3 block w-full appearance-none rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                                                )}
                                                value={project.statusId}
                                                onChange={(e) => {
                                                    const selectedStatus = e.target.value;
                                                    // project.statusId = selectedStatus
                                                    console.log('Selected Status:', selectedStatus);
                                                }}
                                            >
                                                {status.map(status => (
                                                    <option  
                                                        key={status._id} 
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
                                        <Combobox value={selected} onChange={(value) => setSelected(value)} onClose={() => setQuery('')}>
                                            <div className="relative mt-3">
                                                <ComboboxInput
                                                    className={clsx(
                                                        'w-full rounded-lg border-1 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )}
                                                    displayValue={(person: Status | null) => person?.title || ''}
                                                    onChange={(event) => setQuery(event.target.value)}
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
                                                {filteredPeople.map((person) => (
                                                    <ComboboxOption
                                                        key={person.id}
                                                        value={person}
                                                        className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                                                    >
                                                        <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                        <div className="text-sm/6 text-black">{person.title}</div>
                                                    </ComboboxOption>
                                                ))}
                                            </ComboboxOptions>
                                        </Combobox>
                                    </Field>
                                    <Field>
                                        <Label className="text-sm/6 font-medium text-black">Description</Label>
                                        <Textarea
                                            className={clsx(
                                                'mt-3 block w-full resize-y rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                            )}
                                            rows={5}
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
                                    <Field className='mt-3'>
                                        <Label className="text-sm/6 font-medium text-black relative">Member
                                            <div className="cursor-pointer rounded-full absolute -top-0.5 -right-6">
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

                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default ProjectDialog