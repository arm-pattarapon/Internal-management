"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";


type Inputs = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
        console.log("Submitting:", data);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,{
            headers: {
              "Content-Type": "application/json",},
            method: "POST",
            body: JSON.stringify({email: data.email}),
        })

        if (!res.ok) {
            console.log("Error in response:", res);
            
        }else{
            console.log("Password reset email sent");
            router.push("/");
        }


    } catch (error) {
        console.error("Login error:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
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

              <div className="flex justify-center mb-[31px] mt-4">
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer w-full text-[24px]"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
