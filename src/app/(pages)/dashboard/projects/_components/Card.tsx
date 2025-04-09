"use client"

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
    id: string;
    title: string;
}

export default function Card({ id, title }: CardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({ id });


      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="flex flex-col space-y-2 w-full shadow-md rounded px-2 py-1 active:cursor-grabbing z-100">
            <div className="flex justify-between items-center">
                <div className="text-[12px] text-left select-none">{title}</div>
                <div className="flex justify-around space-x-5 items-center">
                    <div className=" text-gray-300 text-[12px] flex space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <label className="select-none" htmlFor="day">12 days</label>
                    </div>
                    <div className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F7374F" className="size-6">
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="line-clamp-2 text-[12px] text-gray-400 text-left select-none">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.
            </div>
            <div className="flex justify-center items-center w-full relative">
                <div className="cursor-pointer rounded-full">
                    <div className="bg-green-200 hover:bg-green-500 text-green-700 text-[12px] px-2 py-1 rounded-full flex items-center justify-center w-5 h-5 select-none">
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
        </div>
    )
}
