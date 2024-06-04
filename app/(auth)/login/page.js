"use client";

import { login } from "@/lib/auth";
import Image from "next/image";
import { useState } from "react";
import Icon from "/public/icon.png";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const r = useRouter();

  const loginHandler = async (e) => {
    e.preventDefault();
    setError(false);
    const data = await login(email, password);
    console.log(data);
    if (data.code == 200) {
      Swal.fire({
        icon: "success",
        title: "Succesfully Login",
        customClass: {
          confirmButton: "my-custom-confirm-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("token", data.token);
          r.push("/");
        }
      });
    } else {
      setError(true);
      setErrMsg(data);
    }
  };
  const registerHandler = (e) => {
    e.preventDefault();
    r.push("/register");
  };
  const backHandler = (e) => {
    e.preventDefault();
    r.push("/");
  };
  return (
    <div className="flex mx-auto my-auto h-screen w-full justify-center items-center">
      <form className="grid gap-4 p-4 border border-gray-200 rounded-lg shadow-2xl" onSubmit={loginHandler}>
        <button className="w-fit font-medium hover:text-yellow-200" onClick={backHandler}>
          Back
        </button>
        <Image src={Icon} width={150} height={150} alt="Icon" className="mx-auto hidden md:block" />
        <h1 className="text-2xl text-center justify-center font-bold">Welcome back!</h1>
        <p className="font-medium text-center">Log in to continue.</p>
        <div className="mb-4 mx-4">
          <label htmlFor="email" className="text-lg font-medium text-gray-900">
            Email
          </label>
          <input
            id="email"
            className="w-full mt-2 p-3 border border-gray-400 rounded-2xl active:focus:border-yellow-300 active:focus:bg-yellow-50"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4 mx-4">
          <label htmlFor="password" className="text-lg font-medium text-gray-900">
            Password
          </label>
          <input id="password" className="w-full mt-2 p-3 border border-gray-400 rounded-2xl" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="mx-5 text-sm font-sans text-red-500">{errMsg}</p>}
        <button className="bg-yellow-400  rounded-2xl p-2 mx-3 font-semibold text-white text-lg hover:bg-yellow-950">Login</button>
        <button className="m-2 font-medium text-sm hover:text-yellow-200" onClick={registerHandler}>
          Create Account
        </button>
      </form>
    </div>
  );
}
