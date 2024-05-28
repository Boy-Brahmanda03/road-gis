"use client";

import Dropdown from "@/components/dropdown";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function HomePage() {
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-4 gap-4 h-full lg:mx-20 px-4 pt-8 pb-4">
        <div className="w-full h-full rounded-lg col-span-4">
          <Map centerMap={[-8.4095, 115.1889]} zoomSize={10.5} editable={false} />
        </div>
      </div>
    </>
  );
}
