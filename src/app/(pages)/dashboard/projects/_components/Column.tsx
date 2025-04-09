"use client"

import Card from "./Card";

export default function Column({ id, title, items }: any) {
    return (
        <div key={id} className="relative bg-white rounded-sm shadow-lg p-3 pt-15 w-full flex flex-col space-y-3">
            <div className=" bg-[#F0F6FF] w-full h-10 rounded-t-sm absolute top-0 left-0 px-2 flex items-center justify-between">
                <div className="text-md text-left ">{title}</div>
                <div className="text-[12px] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
            </div>
            <div className="flex space-y-3 flex-col w-full ">
                {/* Card */}
                {items.map((item: any) => (
                    <Card key={item.id} id={item.id} title={item.title} />
                ))}
            </div>
        </div>
    )
}

