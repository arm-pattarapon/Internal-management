import React from 'react'

interface props {
    placeholder: string;
}

function SearchBox({placeholder}:props) {


    return (
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
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}

export default SearchBox