"use client"

import {
    DndContext,
    closestCorners,
    DragEndEvent,
    DragOverlay,
} from '@dnd-kit/core';

import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from './_components/Column';
import Card from './_components/Card';

type Task = { id: string; title: string };
type Columns = Record<string, Task[]>;


const initialData: Columns = {
    todo: [
        { id: '1', title: 'เขียน report' },
        { id: '2', title: 'ทำ kanban UI' },
    ],
    inprogress: [
        { id: '3', title: 'เรียน Next.js' },
    ],
    done: [
        { id: '4', title: 'ตั้งค่า Tailwind' },
    ],
};

export default function projectsPage() {
    const [columns, setColumns] = useState<Columns>(initialData);
    const [activeCard, setActiveCard] = useState<Task | null>(null);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            setActiveCard(null);
            return;
        }

        let sourceColId = '';
        let targetColId = '';

        for (const colId in columns) {
            if (columns[colId].some((item) => item.id === active.id)) {
                sourceColId = colId;
            }
            if (columns[colId].some((item) => item.id === over.id)) {
                targetColId = colId;
            }
        }

        const sourceItems = [...columns[sourceColId]];
        const targetItems = [...columns[targetColId]];

        const activeIndex = sourceItems.findIndex((item) => item.id === active.id);
        const overIndex = targetItems.findIndex((item) => item.id === over.id);

        const [movedItem] = sourceItems.splice(activeIndex, 1);

        if (sourceColId === targetColId) {
            targetItems.splice(overIndex, 0, movedItem);
        } else {
            targetItems.splice(overIndex, 0, movedItem);
        }

        setColumns({
            ...columns,
            [sourceColId]: sourceColId === targetColId ? targetItems : sourceItems,
            [targetColId]: targetItems,
        });

        setActiveCard(null);
        console.log('columns', columns);
        
    };


    return (
        <div className="bg-white rounded shadow-sm p-5 w-full h-full">
            <div className="flex flex-col h-full">
                <div className="text-[24px] text-left ">
                    Overview
                </div>
                <div className="text-left text-[12px] text-gray-400">Edit or modify all card as you want</div>
                <hr className="border-1 rounded text-gray-300 mt-5 mb-3" />
                <div className="grid grid-cols-3 gap-5 mb-3 ">
                    <div>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-3.5 h-3.5 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F0F6FF] focus:ring-blue-500 focus:border-blue-500 " placeholder="Search Projects" />
                        </div>
                    </div>
                    <div className="col-span-2 flex space-x-5">
                        <div className="w-50">
                            <label htmlFor="datepick" className="mb-2 text-sm font-medium text-gray-900 sr-only">Date</label>
                            <div className="relative">
                                <input type="date" id="datepick" className="block w-full py-2 px-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F0F6FF] focus:ring-blue-500 focus:border-blue-500 " />
                            </div>
                        </div>

                        <div className="relative">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3.5 rounded">
                                + Project
                            </button>
                        </div>

                    </div>

                </div>
                <div className="grid grid-cols-3 gap-5 h-full">
                    {/* column kanban */}
                    <DndContext
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}
                        onDragStart={(event) => {
                            const { active } = event;
                            for (const colId in columns) {
                                const task = columns[colId].find((t) => t.id === active.id);
                                if (task) {
                                    setActiveCard(task);
                                    break;
                                }
                            }
                        }}
                    >
                        
                            {Object.entries(columns).map(([colId, items]) => (
                                <SortableContext key={colId} items={items.map((i) => i.id)}>
                                    <Column id={colId} title={colId.toUpperCase()} items={items} />
                                </SortableContext>
                            ))}
                       

                        <DragOverlay>
                            {activeCard ? (
                                <Card key={activeCard.id} id={activeCard.id} title={activeCard.title} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}