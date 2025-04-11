/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function dashboardPage() {
  const username = Cookies.get("username");
  const email = Cookies.get("email");

  const accessToken = Cookies.get("accessToken");
  const router = useRouter();

  // if (accessToken === undefined || accessToken === "" || accessToken === null) {
  //   router.push("/");
  // } else {
    return (
      <div>
        <div className="text-[24px] text-center mt-[10px] mb-[31px]">
          Welcome {username} ({email})
        </div>
        <div className="text-[24px] text-center mt-[10px] mb-[31px]">{""}</div>
        <div className="text-center text-[12px]">This is your dashboard</div>
      </div>
    );
  // }
}
