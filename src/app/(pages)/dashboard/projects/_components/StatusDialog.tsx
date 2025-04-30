import React from 'react'
import { Button, Dialog, DialogPanel, DialogTitle, Field, Input } from '@headlessui/react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { createStatus, updateStatus } from '../Api';
import clsx from 'clsx';
import { Status } from '../type';

interface props {
    isDialogOpen: boolean;
    toggleStatusDialog: () => void;
}

type Inputs = {
    status: string
}

function StatusDialog({ isDialogOpen , toggleStatusDialog }: props) {    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const submitStatus: SubmitHandler<Inputs> = async ({status}) => {
    
        closeDialog()
    }

    function closeDialog() {
        reset()
        toggleStatusDialog()
    }

    return (
        <Dialog open={isDialogOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeDialog}>
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
                        <form onSubmit={handleSubmit(submitStatus)}>
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
                                    onClick={closeDialog}
                                >
                                    Cancle
                                </Button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default StatusDialog