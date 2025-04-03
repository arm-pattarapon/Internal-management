
"use client"
import { LuChartPie, LuCircleUserRound , LuLayers3, LuFileClock, LuCog, LuLogOut, LuBell,LuDot, LuChevronDown } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from 'next/navigation';
export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const pathname = usePathname();
    console.log(pathname);
    
    const navigation =[
        {name:'Dashboard',href:'/dashboard',icon:LuChartPie,curent:pathname === '/dashboard'},
        {name:'Users',href:'/dashboard/users',icon:LuCircleUserRound,curent:pathname.includes('/dashboard/users')},
        {name:'Projects',href:'/dashboard/projects',icon:LuLayers3,curent:pathname.includes('/dashboard/projects')},
        {name:'Time Sheet',href:'/dashboard/timesheet',icon:LuFileClock,curent:pathname.includes('/dashboard/timesheet')},
        {name:'Settings',href:'/dashboard/settings',icon:LuCog,curent:pathname.includes('/dashboard/settings')}
    ]

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="grid grid-cols-5 gap-0.5 w-full h-full">
                <div className="bg-white col-span-1">
                    <div className="flex flex-col justify-between items-center h-full px-5 py-10">
                        <div className="flex flex-col">
                            <div className="flex">
                                <img className="w-[50px] me-1" src="/Ignite_logo_crop.png" alt="Ignite Logo" />
                                <div className="text-[24px] text-center font-semibold">Ignite Idea</div>
                            </div>
                            
                            <div className="flex flex-col space-y-1.5 mt-5">
                                {navigation.map(item=>(
                                    <Link href={item.href} key={item.name} 
                                    className={classNames(item.curent?'bg-blue-500 text-white shadow-sm shadow-blue-500':
                                        'text-sm text-gray-400 hover:bg-blue-300 hover:text-white',
                                        'p-2 rounded-lg flex cursor-pointer items-center')}>{<item.icon className="me-1"/>}{item.name}</Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center p-2 cursor-pointer text-sm text-gray-400 hover:bg-blue-300 hover:text-white rounded-lg">
                            <LuLogOut className="me-1"/>
                            Sign Out
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="grid grid-rows-10 w-full h-full">
                        <div className="bg-white row-span-1 flex justify-between items-center px-5">
                            <div className="flex text-2xl">
                                Dashboard
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-sm relative cursor-pointer hover:bg-blue-300 group">
                                    <LuDot className="text-red-500 absolute right-0.5 top-0.5"/>
                                    <LuBell className="text-blue-500 group-hover:text-white"/>
                                </div>
                                <div className="rounded-full overflow-hidden border-1 w-[40px] border-gray-300 cursor-pointer">
                                    <img src="/default_user_logo.png" className="w-full h-full object-cover" alt="user" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-sm text-gray-600 font-semibold">Username</div>
                                    <div className="text-sm text-gray-400">Role</div>
                                </div>
                            </div>

                        </div>
                        <div className="row-span-9 flex justify-center items-centers">
                            <div className=" m-5 w-full">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  