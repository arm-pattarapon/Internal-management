"use client"
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  email: string
  password: string
}
export default function loginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className="max-w-lg rounded overflow-hidden shadow-none md:shadow-lg p-4 w-full">
        <div className='flex justify-center'>
          <img className="w-[140px]" src="/Ignite_logo_crop.png" alt="Ignite Logo" />
        </div>
        <div className="px-6 py-4">
          <div className="text-[24px] text-center mt-[31px] mb-[31px]">Ignite Idea</div>
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" mb-[31px]">
                <label className="block text-black text-[12px] mb-2" >
                  Email address
                </label>
                <input {...register("email", { required: true })} className="shadow appearance-none border border-gray-100 rounded w-full py-2 px-3 text-black leading-tight outline-none focus:shadow-outline" id="email" type="text" />
              </div>
              <div className="mb-[31px]">
                <label className="block text-black text-[12px] mb-2" >
                  Password
                </label>
                <input {...register("password", { required: true })} className="shadow appearance-none border border-gray-100 rounded w-full py-2 px-3 text-black leading-tight outline-none focus:shadow-outline" id="password" type="text" />
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center'>
                  <input type="checkbox" />
                  <label className='px-2 text-[12px]'>
                    Remember me
                  </label>
                </div>
                <div>
                  <a href="#" className='text-[10px] text-blue-400'>Forgot Password?</a>
                </div>
              </div>
              <div className='flex justify-center mb-[31px] mt-4'>
                <button className="bg-cyan-500 hover:bg-cyan-500 text-white py-2 px-4 rounded cursor-pointer w-full text-[24px]" type='submit'>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
