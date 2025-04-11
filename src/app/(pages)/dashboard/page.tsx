/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function dashboardPage() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');


  const accessToken = Cookies.get("accessToken");
  const router = useRouter();

  useEffect(()=>{
    setUsername(Cookies.get("username") || '');
    setEmail(Cookies.get("email") || '');
  })
  return (
    <div>
      <div className="text-[24px] text-center mt-[10px] mb-[31px]">
        Welcome {username} ({email})
      </div>
      <div className="text-[24px] text-center mt-[10px] mb-[31px]">{""}</div>
      <div className="text-center text-[12px]">This is your dashboard</div>
    </div>
  );
}
