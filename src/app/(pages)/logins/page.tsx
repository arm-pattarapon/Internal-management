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
      console.log("Submitting:", data);

      // Use Axios for Login API Request
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response:", res.data);

      // Set Cookies
      Cookies.set("accessToken", res.data.accessToken, { expires: 1 });
      Cookies.set("email", data.email, { expires: 1 });

      // Fetch user profile
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

      console.log("Profile response:", profileRes.data);
      Cookies.set("username", profileRes.data.name, { expires: 1 });

      // Redirect to Dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Toaster position="top-center" />
      <div className="bg-white max-w-lg rounded overflow-hidden shadow-none md:shadow-lg p-4 w-full">
        <div className="flex justify-center">
          <img
            className="w-[140px] mt-[20px]"
            src="/Ignite_logo_crop.png"
            alt="Ignite Logo"
          />
        </div>
        <div className="px-6 py-4">
          <div className="text-[24px] text-center mt-[10px] mb-[31px]">
            Ignite Idea
          </div>
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-[31px]">
                <label className="block text-black text-[12px] mb-2">
                  Email address
                </label>
                <input
                  {...register("email", { required: true })}
                  className="shadow appearance-none border border-gray-100 rounded w-full py-2 px-3 text-black leading-tight outline-none focus:shadow-outline"
                  id="email"
                  type="text"
                />
              </div>
              <div className="mb-[31px]">
                <label className="block text-black text-[12px] mb-2">
                  Password
                </label>
                <input
                  {...register("password", { required: true })}
                  className="shadow appearance-none border border-gray-100 rounded w-full py-2 px-3 text-black leading-tight outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <input type="checkbox" />
                  <label className="px-2 text-[12px]">Remember me</label>
                </div>
                <div>
                  <a href="./logins/forgot_password" className="text-[10px] text-blue-400">
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div className="flex justify-center mb-[31px] mt-4">
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer w-full text-[24px]"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
