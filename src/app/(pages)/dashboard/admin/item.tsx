import React from 'react'
import { Status } from '../projects/type'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface props {
    item: Status
}

function item({ item }: props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item._id,
        data: {
            type: "Status",
            item,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='w-full h-5 border-3 border-blue-500 p-3 flex items-center bg-white hover:bg-blue-300'>

        </div>
    )


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className='w-full h-5 border-1 p-3 flex items-center bg-white hover:bg-blue-300'>
            <div className='flex w-full justify-between'>
                <div className='text-sm select-none'>{item.title}</div>
                <div {...listeners} className='cursor-grab'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default item