"use client"
import React,{useEffect} from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from "axios";
// import { cookies } from 'next/headers'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'

type Inputs = {
  email: string
  password: string
}
export default function loginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> =async (data) => {
    console.log(data);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const result = await res.json()

    Cookies.set('accessToken', result.accessToken, { expires: 1 })
    Cookies.set('email', data.email, { expires: 1 })

    async function getData() {
      const AxiosInstance = axios.create({
          baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
      });
      AxiosInstance.interceptors.request.use(
          (config) => {
              const token = Cookies.get('accessToken');
              const accessToken = token;
      
              // If token is present, add it to request's Authorization Header
              if (accessToken) {
                  if (config.headers) config.headers.Authorization = `Bearer ${token}`;
              }
              return config;
          },
          (error) => {
              // Handle request errors here
              return Promise.reject(error);
          }
      );

      AxiosInstance.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response?.status === 401) {
              console.warn("Unauthorized! Redirecting to login...");
              window.location.href = "/";
            }
            return Promise.reject(error);
          }
      );

      AxiosInstance.post('/user/profile',{
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: Cookies.get('email')})
      }).then((response) => {
          console.log(response.data);
          Cookies.set('username', response.data.name, { expires: 1 })
          
      }
      ).catch((error) => {   
          console.log(error);
      }
      )
  }    

  useEffect(() => {
      getData()
  }, [])

    
    router.push('/dashboard')

    // const cookieStore = cookies()
    // await (await cookieStore).set('accessToken', result.accessToken)
    
    // const token = await (await cookieStore).get('accessToken')

    // console.log(token?.value);
    
  }
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className="bg-white max-w-lg rounded overflow-hidden shadow-none md:shadow-lg p-4 w-full">
        <div className='flex justify-center'>
          <img className="w-[140px] mt-[20px]" src="/Ignite_logo_crop.png" alt="Ignite Logo" />
        </div>
        <div className="px-6 py-4">
          <div className="text-[24px] text-center mt-[10px] mb-[31px]">Ignite Idea</div>
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
