"use client";

import Navbar from "@/components/navbar";
import { getMasterRuasJalan } from "@/lib/road";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";
import PieChart from "@/components/pieChart";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function HomePage() {
  const [token, setToken] = useState();
  const [roads, setRoads] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token) {
      getMasterRuasJalan(token).then((data) => {
        console.log(data);
        const decodedRoads = data.map((ruas) => ({
          ...ruas,
          decodedPaths: polyline.decode(ruas.paths),
        }));
        console.log(decodedRoads);
        setRoads(decodedRoads);
      });
    }
  }, [token]);

  return (
    <div className="h-screen">
      <div className="h-5/6">
        <Navbar />
        <div className="grid grid-cols-4 gap-4 h-full lg:mx-20 px-4 pt-8 pb-4">
          <div className="w-full h-full rounded-lg col-span-4">
            <Map centerMap={[-8.4095, 115.1889]} zoomSize={10.5} data={roads} editable={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
