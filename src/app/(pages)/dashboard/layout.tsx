/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import {
  LuChartPie,
  LuCircleUserRound,
  LuLayers3,
  LuFileClock,
  LuCog,
  LuLogOut,
  LuBell,
  LuDot,
  LuChevronDown,
} from "react-icons/lu";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useTransition, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spinner from "@/app/component/spiner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    useEffect(()=>{
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
          router.push("/"); 
        }else{
            setUsername(Cookies.get("username") || '');
            setEmail(Cookies.get("email") || '');
            console.log('test useeffect');
            
        }
    },[pathname]) 
 
    const [isPending, startTransition] = useTransition();




    const navigation = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LuChartPie,
        curent: pathname === "/dashboard",
      },
      {
        name: "Users",
        href: "/dashboard/users",
        icon: LuCircleUserRound,
        curent: pathname.includes("/dashboard/users"),
      },
      {
        name: "Projects",
        href: "/dashboard/projects",
        icon: LuLayers3,
        curent: pathname.includes("/dashboard/projects"),
      },
      {
        name: "Time Sheet",
        href: "/dashboard/timesheet",
        icon: LuFileClock,
        curent: pathname.includes("/dashboard/timesheet"),
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: LuCog,
        curent: pathname.includes("/dashboard/settings"),
      },
    ];

    const Notification = [
      {
        title: "New Message",
        content:
          "Nulla facilisi. Pellentesque consectetur eu risus sed scelerisque. Suspendisse suscipit iaculis mi eget viverra. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus quis sem odio. Aliquam ut erat enim. In iaculis diam vitae justo rhoncus vehicula. Sed ullamcorper arcu non ante laoreet, sit amet scelerisque lectus luctus. Integer sagittis neque sit amet bibendum maximus.",
        read: false,
        href: "#",
      },
      // Add more notifications as needed...
    ];

    function classNames(...classes: string[]) {
      return classes.filter(Boolean).join(" ");
    }

    // Sign out function
    const handleSignOut = (router: any) => {
      // Clear all cookies
      Object.keys(Cookies.get()).forEach((cookie) => {
        Cookies.remove(cookie);
      });

      // Redirect to the homepage or login page
      router.push("/"); // You can replace "/" with "/login" if you have a separate login page
    };

    return (
      <div className="h-screen flex justify-center items-center">
        <div className="grid grid-cols-5 gap-0.5 w-full h-full">
          <div className="bg-white col-span-1">
            <div className="flex flex-col justify-between items-center h-full px-5 py-10">
              <div className="flex flex-col">
                <div className="flex">
                  <img
                    className="w-[50px] me-1"
                    src="/Ignite_logo_crop.png"
                    alt="Ignite Logo"
                  />
                  <div className="text-[24px] text-center font-semibold select-none">
                    Ignite Idea
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5 mt-5">
                  {navigation.map((item) => (
                    <Link
                      href={item.href}
                      key={item.name}
                      onClick={() => startTransition(() => {})}
                      className={classNames(
                        item.curent
                          ? "bg-blue-500 text-white shadow-sm shadow-blue-500"
                          : "text-sm text-gray-400 hover:bg-blue-300 hover:text-white",
                        "p-2 rounded-lg flex cursor-pointer items-center select-none"
                      )}
                    >
                      {<item.icon className="me-1" />}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Sign Out button */}
              <div
                onClick={() => handleSignOut(router)} // Pass the router to handleSignOut here
                className="flex items-center p-2 cursor-pointer text-sm text-gray-400 hover:bg-blue-300 hover:text-white rounded-lg select-none"
              >
                <LuLogOut className="me-1" />
                Sign Out
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="flex bg-[#ededed] flex-col w-full h-full">
              <div className="bg-white flex justify-between items-center h-15 px-5">
                <div className="flex text-2xl select-none">Dashboard</div>
                <div className="flex items-center space-x-2">
                  <Menu as="div" className="relative">
                    {({ open }) => (
                      <>
                        <MenuButton
                          className={`p-2 rounded-sm relative cursor-pointer group transition-all duration-200 focus:outline-none ${
                            open
                              ? "bg-blue-500 text-white shadow-md shadow-blue-500"
                              : "hover:bg-blue-300"
                          }`}
                        >
                          <LuDot className="text-red-500 absolute text-[30px] origin-top-right top-[-5px]" />
                          <LuBell
                            className={`group-hover:text-white ${
                              open ? "text-white" : "text-blue-500"
                            }`}
                          />
                        </MenuButton>
                        <MenuItems
                          aria-labelledby="notiAction"
                          className="flex flex-col space-y-1 z-100 bg-white absolute origin-top-right mt-1 border border-gray-100 right-0 w-[300px] min-h-[500px] max-h-[500px] overflow-y-scroll rounded-lg shadow-lg focus:outline-none"
                        >
                          <div className="mt-2">
                            <p className="ps-1">Notification</p>
                            <hr className="border-0.5 rounded-full" />
                          </div>
                          {Notification.map((item, index) => (
                            <MenuItem
                              key={index}
                              as={Link}
                              href="#"
                              className={`hover:bg-blue-300 px-1 rounded-lg relative ${
                                item.read ? "text-black" : "text-gray-400"
                              }`}
                            >
                              {item.read && (
                                <LuDot className="text-red-500 absolute text-[30px] origin-top-right top-[-5px] right-0" />
                              )}

                              <p>{item.title}</p>
                              <p className="line-clamp-3">{item.content}</p>
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </>
                    )}
                  </Menu>

                  <div className="rounded-full overflow-hidden border-1 w-[40px] border-gray-300 cursor-pointer">
                    <img
                      src="/default_user_logo.png"
                      className="w-full h-full object-cover"
                      alt="user"
                    />
                  </div>
                  <div className="flex flex-col cursor-pointer select-none">
                    <div className="text-sm text-gray-600 font-semibold flex items-center">
                      {username}
                      <LuChevronDown className="text-blue-500 ms-5" />
                    </div>
                    <div className="text-sm text-gray-400">Role</div>
                  </div>
                </div>
              </div>
              <div className="flex w-full h-full justify-center items-centers relative">
                <div className="m-5 w-full h-auto">
                  {isPending && (
                    <Spinner/>
                  )}
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  
}
