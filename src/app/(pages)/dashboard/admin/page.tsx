"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Status } from '../projects/type';
import { getStatusData } from '../projects/Api';
import Item from './item';
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

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function Admin() {
    const [status, setStatus] = useState<Status[]>([]);
    const [activeDragging, setActiveDragging] = useState<Status|null>(null)
    const [isLoad, setIsLoad] = useState(false)

      const StatusIds = useMemo(() => {
        return status.map((status) => status._id);
      }, [status]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    );

    function onDragStart(event: DragStartEvent) { 
        console.log("draging :", event.active);
        document.body.style.setProperty("cursor", "grabbing", "important");
        const type = event.active.data.current?.type;

        setActiveDragging(event.active.data.current?.item);
        
    }

    function onDragEnd(event: DragEndEvent) { 
        document.body.style.setProperty("cursor", "default", "important");
        setActiveDragging(null);

    }

    function onDragOver(event: DragOverEvent) { 
        const {active, over} = event
        const activeId = active.id
        const overId = over?.id

        if(activeId === overId) return;

        setStatus(status=>{
            const activeStatusIndex = status.findIndex(s => s._id === activeId);
            const overStatusIndex = status.findIndex(s => s._id === overId);
            if (activeStatusIndex === -1 || overStatusIndex === -1) return status;
            return arrayMove(status, activeStatusIndex, overStatusIndex);
        })
    }

    useEffect(() => {

        async function fetchInitialData() {
            try {
                setIsLoad(true)
                const [status] = await Promise.all([
                    getStatusData(),
                ]);
                setStatus(status);
                setIsLoad(false)
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        }

        fetchInitialData();
    }, []);


    return (
        <div className='h-full w-full bg-white rounded shadow flex flex-col space-y-1 py-5'>

            <section id='status' className='relative flex flex-col items-center space-y-3'>
                <div className='absolute flex gap-1 right-[5%]'>
                    <div>
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only"
                        >
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-3.5 h-3.5 text-gray-500 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F0F6FF] focus:ring-blue-500 focus:border-blue-500 "
                                placeholder='Search status'
                            />
                        </div>
                    </div>
                    <div
                        className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-blue-700 focus:outline-1 focus:outline-white open:bg-gray-700 hover:cursor-pointer"
                    >
                        + Status
                    </div>
                </div>
                <div className='text-center font-bold text-2xl'>Project status</div>
                <DndContext
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                    collisionDetection={pointerWithin}
                >
                    <div className='flex flex-col gap-1 w-[90%] max-w-[90%] h-100 border-1 overflow-y-auto'>
                        {/* item */}
                        <SortableContext
                            items={StatusIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {status.map(s => (
                                <Item key={s._id} item={s} />
                            ))}
                        </SortableContext>
                    </div>

                    <DragOverlay>
                    {activeDragging && (
                        <Item
                            item={activeDragging}
                        />
                    )}
                    </DragOverlay>

                </DndContext>

            </section>
        </div>
    )
}

export default Admin