"use client";

import { register } from "@/lib/auth";
import Image from "next/image";
import { useState } from "react";
import Icon from "/public/Navigation-cuate.svg";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const r = useRouter();

  const registerHandler = async (e) => {
    e.preventDefault();
    setError(false);
    const data = await register(name, email, password);
    console.log(data);
    if (data.code == 200) {
      alert(data.message);
      //   r.push("/");
    } else {
      setError(true);
      setErrMsg(data);
    }
  };
  const loginHandler = (e) => {
    e.preventDefault();
    r.push("/login");
  };
  const backHandler = (e) => {
    e.preventDefault();
    r.back();
  };
  return (
    <div className="flex mx-auto my-auto h-screen w-full justify-center items-center">
      <div className="grid md:grid-cols-2 gap-4 border border-gray-200 rounded-lg shadow-md p-4">
        <div className="p-4 justify-center items-center">
          <button className="w-fit font-medium hover:text-yellow-200" onClick={backHandler}>
            Back
          </button>
          <Image src={Icon} width={450} height={450} alt="Icon" className="mx-auto hidden md:block" />
        </div>
        <div>
          <form className="grid gap-4 p-4" onSubmit={registerHandler}>
            <h1 className="text-2xl text-center justify-center font-bold mb-3">Create Account</h1>
            <div className="mb-4 mx-4">
              <label htmlFor="name" className="text-lg font-medium text-gray-900">
                Name
              </label>
              <input
                id="name"
                className="w-full mt-2 p-3 border border-gray-400 rounded-2xl active:focus:border-yellow-300 active:focus:bg-yellow-50"
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <button className="bg-yellow-400  rounded-2xl p-2 mx-3 font-semibold text-white text-lg hover:bg-yellow-950">Register</button>
            <button className="m-2 font-medium text-sm hover:text-yellow-200" onClick={loginHandler}>
              Already Have Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
