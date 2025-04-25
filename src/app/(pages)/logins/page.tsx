/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      Cookies.set("accessToken", res.data.accessToken, { expires: 1 });
      Cookies.set("email", data.email, { expires: 1 });

      const profileRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        { email: data.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${res.data.accessToken}`,
          },
        }
      );

      Cookies.set("username", profileRes.data.name, { expires: 1 });
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('/images/login_page/hands-table-business-meeting.jpg')",
      }}
    >
      {/*  Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/*  Toast notifications */}
      <Toaster position="top-center" />

      {/*  Login Card (glassmorphism) */}
      <div className="bg-white/30 backdrop-blur-xs border border-white/20 z-10 max-w-lg rounded-2xl shadow-xl p-6 w-full relative">
        <div className="flex justify-center">
          <img
            className="w-[140px] mt-[10px]"
            src="/Ignite_logo_crop.png"
            alt="Ignite Logo"
          />
        </div>

        <div className="px-6 py-4">
          <div className="text-[24px] text-center mt-[10px] mb-[31px] text-white font-semibold">
            Ignite Idea
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-white text-sm mb-1">
                Email address
              </label>
              <input
                {...register("email", { required: true })}
                className="bg-white/80 border border-gray-200 rounded w-full py-2 px-3 text-gray-800 leading-tight outline-none focus:ring-2 focus:ring-cyan-500"
                type="text"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Password</label>
              <input
                {...register("password", { required: true })}
                className="bg-white/80 border border-gray-200 rounded w-full py-2 px-3 text-gray-800 leading-tight outline-none focus:ring-2 focus:ring-cyan-500"
                type="password"
              />
            </div>

            <div className="flex justify-between text-xs text-white">
              <div className="flex items-center">
                <input type="checkbox" />
                <label className="ml-2">Remember me</label>
              </div>
              <a
                href="./logins/forgot_password"
                className="text-white hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="text-white py-2 px-4 rounded w-full text-[18px] transition-all duration-200"
                style={{ backgroundColor: "#3D90D7" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3483c4")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3D90D7")
                }
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
