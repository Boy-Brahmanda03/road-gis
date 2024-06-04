"use client";

import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function HomePage() {
  return (
    <div className="h-screen">
      <div className="h-5/6">
        <Navbar />
        <div className="grid grid-cols-4 gap-4 h-full lg:mx-20 px-4 pt-8 pb-4">
          <div className="w-full h-full rounded-lg col-span-4">
            <Map centerMap={[-8.4095, 115.1889]} zoomSize={10.5} editable={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
