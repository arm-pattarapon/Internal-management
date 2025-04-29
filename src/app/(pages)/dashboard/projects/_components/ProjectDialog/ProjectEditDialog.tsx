import React, { useEffect, useState } from 'react'
import { Button, Field, Input, Label, Select, Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Textarea, Fieldset, Legend, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from 'clsx';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Lead, Project, Status, Users } from '../../type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CalendarIcon } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from '@/app/component/spiner';
import { updateProject } from '../../Api';

interface props {
    project: Project;
    users: Users[];
    status: Status[];
    type: string[];
    toggleMemberDialog: () => void;
    toggleEditMode: () => void;
}

type Inputs = {
    _id: string,
    name: string,
    statusId: string,
    type: string,
    description: string,
    projectManager: string|null,
    businessanalystLead: string|null,
    developerLead: string|null,
    note: string,
    dueDate: Date,
}



function ProjectEditDialog({ project, users, status, type, toggleMemberDialog, toggleEditMode }: props) {
    const [isLoad, setIsLoad] = useState(false)
    const [queryType, setQueryType] = useState('')
    const [selectedStatus, setSelectedStatus] = useState<Status>(status.find(s => s._id === project.statusId) || status[0])
    const [selectedType, setSelectedType] = useState<string | null>(project.type)

    const [queryLead, setQueryLead] = useState('');
    const [selectedPM, setSelectedPM] = useState<Users | null>(users.find(user => user._id === project.projectManager._id) || null)
    const [selectedBA, setSelectedBA] = useState<Users | null>(users.find(user => user._id === project.businessanalystLead._id) || null)
    const [selectedDevLead, setSelectedDevLead] = useState<Users | null>(users.find(user => user._id === project.developerLead._id) || null)

    const [startDate, setStartDate] = useState<Date | null>(project.startDate||null)
    const [endDate, setEndDate] = useState<Date | null>(project.dueDate||null)
    

    const filteredLead = queryLead === '' ? users : users.filter(user => {
        return user.name.toLowerCase().includes(queryLead.toLowerCase())
    })

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

    const submitForm: SubmitHandler<Inputs> = async (data: Inputs) => {
        setIsLoad(true)
        data._id = project._id
        data.projectManager = selectedPM ? selectedPM._id : null
        data.businessanalystLead = selectedBA ? selectedBA._id : null
        data.developerLead = selectedDevLead ? selectedDevLead._id :null
        try {
            console.log('data :',data);
            await updateProject(data)
            
        } catch (error) {
            throw new Error("error update project: ")
        }finally{
            setIsLoad(false)
            toggleMemberDialog()
            window.location.reload();
        }
        
        
    }

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            {isLoad && <Spinner />}
            <Fieldset className='flex flex-col space-y-3'>
                <Legend className="text-lg font-bold">Project details</Legend>
                <Field disabled={isLoad}>
                    <Label className="text-sm/6 font-medium text-black">Project Name</Label>
                    <Input
                        className={clsx(
                            'block w-full rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                        placeholder={project.name}
                        defaultValue={project.name}
                        {...register("name")}
                    />
                </Field>
                <Field disabled={isLoad}>
                    <Label className="text-sm/6 font-medium text-black">Project Status</Label>
                    <div className="relative">
                        <Select
                            className={clsx(
                                'block w-full appearance-none rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                            )}
                            value={selectedStatus._id}
                            {...register('statusId', {
                                onChange: (e) => {
                                    const selectedStatus = e.target.value;
                                    const newSelectedStatus = status.find(s => s._id === selectedStatus);
                                    setSelectedStatus(newSelectedStatus || status[0]);
                                },
                            })}
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
                <Field disabled={isLoad}>
                    <Label className="text-sm/6 font-medium text-black">Project Type</Label>
                    <Combobox value={selectedType} onChange={(value) => setSelectedType(value)} onClose={() => setQueryType('')}>
                        <div className="relative">
                            <ComboboxInput
                                className={clsx(
                                    'w-full rounded-lg border-1 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                                    'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                                )}
                                displayValue={() => selectedType || ''}
                                defaultValue={selectedType || ''}
                                {...register('type', {
                                    onChange: (event) => {
                                        setQueryType(event.target.value);
                                        setSelectedType(event.target.value);
                                    },
                                })}
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
                <Field disabled={isLoad}>
                    <Label className="text-sm/6 font-medium text-black">Description</Label>
                    <Textarea
                        className={clsx(
                            'block w-full resize-y rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                        rows={5}
                        defaultValue={project.description}
                        placeholder={project.description}
                        {...register('description')}
                    />
                </Field>
                <Field disabled={isLoad}>
                    <Label className="text-sm/6 font-medium text-black">Note</Label>
                    <Textarea
                        className={clsx(
                            'block w-full resize-y rounded-lg border-1 bg-white/5 py-1.5 px-3 text-sm/6 text-black',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                        rows={5}
                        defaultValue={project.note}
                        placeholder={project.note}
                        {...register('note')}
                    />
                </Field>
                <Field>
                    <div className="grid grid-cols">
                        <div className='relative flex flex-col space-y-1'>
                            <CalendarIcon className="absolute left-3 top-10 text-gray-500 h-4 w-4" />
                            
                            <Label className="text-sm/6 font-medium text-black">End Date</Label>
                            <DatePicker
                                selected={endDate}
                                dateFormat="dd/MM/yyyy"
                                locale="en"
                                className="w-full border rounded-md pl-9 pr-3 py-2 z-50"
                                calendarStartDay={1}
                                onChange={(date) => {
                                    setEndDate(date);
                                    if (date) {
                                        const event = { target: { name: 'dueDate', value: date } };
                                        register('dueDate').onChange(event);
                                    }
                                }}
                                disabled={isLoad}
                            />
                        </div>
                    </div>
                </Field>
                <div className='grid grid-cols-3 gap-1 mt-3'>
                    <Field disabled={isLoad} className='flex flex-col items-center text-center space-y-1'>
                        <Label className="text-sm/6 font-medium text-black">Project Lead</Label>
                        <Combobox value={selectedPM} onChange={(value) => setSelectedPM(value)} onClose={() => setQueryLead('')}>
                            <div className="relative">
                                <ComboboxInput
                                    className={clsx(
                                        'w-full rounded-lg border-1 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                                    )}
                                    displayValue={(user: Users | null) => user?.name || ''}
                                    onChange={(e)=>{
                                        setQueryLead(e.target.value)
                                    }}
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                    <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    'w-(--input-width) rounded-xl border-1 bg-white z-50 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                                    'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                                )}
                            >
                                {filteredLead.map((user) => (
                                    <ComboboxOption
                                        key={user._id}
                                        value={user}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                    >
                                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                                        <div className="text-sm/6 text-black">{user.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </Field>
                    <Field disabled={isLoad} className='flex flex-col items-center text-center space-y-1'>
                        <Label className="text-sm/6 font-medium text-black">Business Analyst Lead</Label>
                        <Combobox value={selectedBA} onChange={(value) => setSelectedBA(value)} onClose={() => setQueryLead('')}>
                            <div className="relative">
                                <ComboboxInput
                                    className={clsx(
                                        'w-full rounded-lg border-1 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                                    )}
                                    displayValue={(user: Users | null) => user?.name || ''}
                                    onChange={(e)=>{
                                        setQueryLead(e.target.value)
                                    }}
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                    <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    'w-(--input-width) rounded-xl border-1 bg-white z-50 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                                    'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                                )}
                            >
                                {filteredLead.map((user) => (
                                    <ComboboxOption
                                        key={user._id}
                                        value={user}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                    >
                                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                                        <div className="text-sm/6 text-black">{user.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </Field>
                    <Field disabled={isLoad} className='flex flex-col items-center text-center space-y-1'>
                        <Label className="text-sm/6 font-medium text-black">Developer Lead</Label>
                        <Combobox value={selectedDevLead} onChange={(value) => setSelectedDevLead(value)} onClose={() => setQueryLead('')}>
                            <div className="relative">
                                <ComboboxInput
                                    className={clsx(
                                        'w-full rounded-lg border-1 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                                    )}
                                    displayValue={(user: Users | null) => user?.name || ''}
                                    onChange={(e)=>{
                                        setQueryLead(e.target.value)
                                    }}
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                    <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    'w-(--input-width) rounded-xl border-1 bg-white z-50 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                                    'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                                )}
                            >
                                {filteredLead.map((user) => (
                                    <ComboboxOption
                                        key={user._id}
                                        value={user}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                    >
                                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                                        <div className="text-sm/6 text-black">{user.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </Field>
                </div>
                <Field disabled={isLoad}>
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