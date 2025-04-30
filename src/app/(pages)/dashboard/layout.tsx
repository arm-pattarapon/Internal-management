"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useTransition, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spinner from "@/app/component/spiner";
import axios from "axios";
import { IconType } from "react-icons/lib";

interface navigation{
  name:string,
  href:string,
  icon: IconType,
  curent: boolean
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navigationList = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LuChartPie,
      curent: false,
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: LuCircleUserRound,
      curent: false,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: LuLayers3,
      curent: false,
    },
    {
      name: "Time Sheet",
      href: "/dashboard/timesheet",
      icon: LuFileClock,
      curent: false,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: LuCog,
      curent: false,
    },
  ];

  const [navigation , setNavigation] = useState<navigation[]>(navigationList)

  const Notification = [
    {
      title: "New Message",
      content: "This is a sample notification content.",
      read: false,
      href: "#",
    },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handleSignOut = () => {
    Object.keys(Cookies.get()).forEach((cookie) => {
      Cookies.remove(cookie);
    });
    router.push("/");
  };

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    startTransition(async () => {
      if (!accessToken) return router.push("/");
      
      const email = Cookies.get("email")

      setUsername(Cookies.get("username") || "");
      setEmail(email || "");
      
      const profileRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data } = profileRes;
      const user = data;
      
      if(user.isAdmin){
        setNavigation(prevNavigation => {
          if (!prevNavigation.some(nav => nav.name === "Admin Setting")) {
            return [
              ...prevNavigation,
              {
          name: "Admin Setting",
          href: "/dashboard/admin",
          icon: LuCog,
          curent: pathname.includes("/dashboard/admin"),
              },
            ];
          }
          return prevNavigation;
        });
      }

      setNavigation(navigations =>
        navigations.map(navigation => {
          if (navigation.href === "/dashboard") 
            return { ...navigation, curent: pathname===navigation.href };
         
          return { ...navigation, curent: pathname.includes(navigation.href) };

        })
      );
    });
  }, [pathname]);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`bg-white transition-all duration-300 shadow-md h-full ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <div className="flex flex-col justify-between h-full px-3 py-6">
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-6">
              <img src="/Ignite_logo_crop.png" className="w-10" alt="Logo" />
              {sidebarOpen && <span className="text-lg font-bold">Ignite Idea</span>}
            </div>

            {/* Menu */}
            <nav className="flex flex-col space-y-1.5">
              {navigation.map((item, index) => (
                <div
                  key={index}
                  onClick={(e) => e.stopPropagation()} // ป้องกันปิด sidebar ตอนกดเมนู
                >
                  <Link
                    href={item.href}
                    className={classNames(
                      item.curent
                        ? "bg-blue-500 text-white shadow-sm shadow-blue-500"
                        : "text-sm text-gray-400 hover:bg-blue-300 hover:text-white",
                      "p-2 rounded-lg flex items-center"
                    )}
                  >
                    <item.icon className="text-lg me-2" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Sign Out */}
          <div
            onClick={(e) => {
              e.stopPropagation(); // ป้องกัน sidebar ปิด
              handleSignOut();
            }}
            className="flex items-center cursor-pointer text-sm text-gray-400 hover:bg-blue-300 hover:text-white p-2 rounded-lg"
          >
            <LuLogOut className="me-2" />
            {sidebarOpen && "Sign Out"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#ededed]">
        {/* Header */}
        <div className="bg-white flex justify-between items-center h-15 px-5 py-3 shadow">
          <div className="text-2xl font-semibold">Dashboard</div>
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <MenuButton
                    className={`p-2 rounded-full relative group transition-all duration-200 ${
                      open
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500"
                        : "hover:bg-blue-300"
                    }`}
                  >
                    <LuDot className="text-red-500 absolute text-[30px] top-[-5px]" />
                    <LuBell className={open ? "text-white" : "text-blue-500"} />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-[300px] bg-white border border-gray-100 rounded-lg shadow-lg max-h-[500px] overflow-y-auto z-50 p-2">
                    <div>
                      <p className="font-semibold mb-1">Notification</p>
                      <hr />
                    </div>
                    {Notification.map((item, i) => (
                      <MenuItem
                        key={i}
                        as="div"
                        className="p-2 hover:bg-blue-300 rounded-lg text-sm cursor-pointer"
                      >
                        <p className="font-semibold">{item.title}</p>
                        <p className="line-clamp-2">{item.content}</p>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </>
              )}
            </Menu>

            {/* User Info */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <img
                src="/default_user_logo.png"
                className="w-10 h-10 rounded-full border"
                alt="User"
              />
              <div className="flex flex-col">
                <div className="flex items-center font-semibold text-sm text-gray-600">
                  {username}
                  <LuChevronDown className="ml-2 text-blue-500" />
                </div>
                <div className="text-xs text-gray-400">Role</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isPending && <Spinner />}
          {children}
        </div>
      </div>
    </div>
  );
}
