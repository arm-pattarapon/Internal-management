"use client"
import { useState,useEffect  } from 'react';
import { useRouter } from 'next/navigation'

export default function createSheetPage() {
    const [projectname, setProjectName] = useState('');
    const [date, setDate] = useState('');
    const [hoursone, setHoursOne] = useState('');
    const [hourstwo, setHoursTwo] = useState('');
    const [details, setDetails] = useState('');
    const [role, setRole] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const editData = JSON.parse(localStorage.getItem('editSheet') || 'null');
        if (editData) {
            setEditIndex(editData.index); // <-- เก็บ index ไว้
            setProjectName(editData.data.projectname);
            setDate(editData.data.date);
            setHoursOne(editData.data.hoursone);
            setHoursTwo(editData.data.hourstwo);
            setDetails(editData.data.details);
            setRole(editData.data.role);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTimeSheet = { projectname, date, hoursone, hourstwo, details, role };
        let timeSheets = JSON.parse(localStorage.getItem('timeSheets') ?? '[]');
    
        if (editIndex !== null) {
            timeSheets[editIndex] = newTimeSheet; // <-- แก้ไขอันเก่า
        } else {
            timeSheets.push(newTimeSheet); // <-- เพิ่มใหม่
        }
    
        localStorage.setItem('timeSheets', JSON.stringify(timeSheets));
        localStorage.removeItem('editSheet');
        router.push('/dashboard/timesheet');
    };

    const handleCancel = () => {
        localStorage.removeItem('editSheet');
        router.push('/dashboard/timesheet');
      };

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full">
            <form onSubmit={handleSubmit}>
                <div className="w-full h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col justify-between">
                    <div>
                        <div>
                            <h1>New Time Sheet</h1>
                        </div>
                        <div className="mt-10">
                            <div className="mt-2">
                                <label htmlFor="project_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Name:</label>
                                <input type="text" id="projectname"
                                    value={projectname}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                            </div>
                            <div className="mt-2">
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date:</label>
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    </div>                            </div>
                                <input type="date" id="date" value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                            </div>
                            <div className="grid gap-6 mb-6 md:grid-cols-2">
                                <div className="mt-2">
                                    <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time:</label>
                                    <input type="time" value={hoursone}
                                        onChange={(e) => setHoursOne(e.target.value)}
                                        required className="py-2.5 sm:py-3 border border-gray-300 px-4 block w-full  rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-400 dark:focus:ring-neutral-600"></input>
                                </div>
                                <div className="mt-9">
                                    <input type="time" value={hourstwo}
                                        onChange={(e) => setHoursTwo(e.target.value)}
                                        required className="py-2.5 sm:py-3 border border-gray-300 px-4 block w-full  rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-400 dark:focus:ring-neutral-600"></input>
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role:</label>
                                <select id="countries" value={role}
                                    onChange={(e) => setRole(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="Developer">Developer</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Business Analyst">Business Analyst</option>
                                    <option value="Software Tester">Software Tester</option>
                                </select>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="detail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detail:</label>
                                <textarea id="detail" rows={4} value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    required className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>                    </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mt-12">
                        <div className="mr-4 w-full">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                                Save
                            </button>
                        </div>
                        <div className="w-full">
                            <button type="button" onClick={handleCancel} className="bg-blue-100 hover:bg-blue-300 text-blue-500 font-bold py-2 px-4 rounded w-full">
                                Cancle
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
