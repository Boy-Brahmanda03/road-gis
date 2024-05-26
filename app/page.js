"use client";

import Dropdown from "@/components/dropdown";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

const MapSetting = () => {
  return (
    <>
      <div className="mb-4">
        <Link href={"/road/add"}>
          <button className="w-full p-2 rounded-lg bg-white shadow-sm border border-gray-200 text-black font-semibold hover:shadow-lg hover:bg-yellow-300">Add Road</button>
        </Link>
      </div>
      <div className="mb-4 bg-white shadow-md rounded-lg border border-gray-200 h-fit p-4">
        <h1 className="font-bold text-lg mb-3">Map Settings</h1>
        <Dropdown title={"Provinsi"} />
      </div>
    </>
  );
};

export default function HomePage() {
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  console.log(token);

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-4 gap-4 h-full lg:mx-20 px-4 pt-8 pb-4">
        <div className={clsx("w-full h-full rounded-lg", token ? "col-span-3" : "col-span-4 ")}>
          <Map centerMap={[-8.4095, 115.1889]} zoomSize={10.5} editable={false} />
        </div>
        <div className={clsx(token ? "col-span-1 mx-auto" : "hidden")}>{token && MapSetting()}</div>
      </div>
    </>
  );
}
