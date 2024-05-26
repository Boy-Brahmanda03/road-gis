"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { addRuasJalan } from "@/lib/road";
import { data } from "autoprefixer";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

const calculateDistance = (positions) => {
  let total = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    const marker = L.latLng(positions[i]);
    const nextMarker = L.latLng(positions[i + 1]);
    total += marker.distanceTo(nextMarker);
  }
  return total;
};

const Form = () => {
  const r = useRouter();
  //posisi click marker polyline
  const [clickedPositions, setClickedPositions] = useState([]);
  //panjang polyline
  const [distance, setDistance] = useState(0);
  //polyline encoded
  const [encodePos, setEncodePos] = useState();

  const [token, setToken] = useState();

  const [kodeRuas, setKodeRuas] = useState();
  const [desaId, setDesaId] = useState("473");
  const [namaRuas, setNamaRuas] = useState();
  const [lebarRuas, setLebarRuas] = useState();
  const [eksistingId, setEksistingId] = useState();
  const [kondisiId, setKondisiId] = useState();
  const [jenisJalanId, setJenisJalanId] = useState();
  const [keterangan, setKeterangan] = useState();

  const handleMapClick = (position) => {
    console.log("Clicked position:", position);
    setClickedPositions((prevPositions) => [...prevPositions, position]);
    const encodePositions = polyline.encode(clickedPositions);
    setEncodePos(encodePositions);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(token, encodePos, desaId, kodeRuas, namaRuas, distance.toFixed(2), lebarRuas, eksistingId, kondisiId, jenisJalanId, keterangan);
    const addData = await addRuasJalan(token, encodePos, desaId, kodeRuas, namaRuas, distance.toFixed(2), lebarRuas, eksistingId, kondisiId, jenisJalanId, keterangan);
    console.log(addData);
    if (addData.code == 200) {
      alert(addData.status);
      r.push("/");
    } else {
      alert("Insert gagal");
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (clickedPositions.length > 1) {
      const length = calculateDistance(clickedPositions);
      console.log(length);
      setDistance(length);
    }
  }, [clickedPositions]);

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-4 gap-3 h-fit lg:mx-20 px-4 pt-4 pb-4">
        <div className="w-full h-full rounded-lg col-span-2">
          <Map centerMap={[-8.794362792742106, 115.1626069720084]} zoomSize={13} editable={true} onClick={handleMapClick} />
        </div>
        <div className="col-span-2 mx-auto w-full">
          <div className="bg-white shadow-lg rounded-lg flex-1 border border-gray-200">
            <div className="flex mb-3">
              <h2 className="flex-1 font-sans font-bold text-3xl ms-5 my-5 text-black">Add Road Data</h2>
              <button className="me-8 justify-end items-end">X</button>
            </div>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2 mx-5">
                <label className="block mb-2 text-lg font-medium">Kode Ruas</label>
                <input
                  type="text"
                  name="koderuas"
                  id="koderuas"
                  className="border border-gray-300text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Kode ruas jalan"
                  required=""
                  value={kodeRuas}
                  onChange={(e) => {
                    setKodeRuas(e.target.value);
                  }}
                />
              </div>
              <div className="sm:col-span-2 mx-5">
                <label className="block mb-2 text-lg font-medium">Nama Ruas Jalan</label>
                <input
                  type="text"
                  name="namaruas"
                  id="namaruas"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Nama ruas jalan"
                  value={namaRuas}
                  onChange={(e) => {
                    setNamaRuas(e.target.value);
                  }}
                  required=""
                />
              </div>
              <div className="sm:col-span-2 mx-5">
                <label className="block mb-2 text-lg font-medium">Paths</label>
                <input
                  type="text"
                  name="paths"
                  id="paths"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Ruas jalan"
                  required=""
                  value={encodePos}
                  readOnly
                />
              </div>
              <div className="ms-5 md:col-span-1 sm:mx-5 sm:col-span-2">
                <label className="block mb-2 text-lg font-medium">Panjang</label>
                <div className="flex">
                  <input
                    type="text"
                    name="panjang"
                    id="panjang"
                    className="border border-gray-300 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Panjang ruas jalan"
                    value={distance.toFixed(1)}
                    required=""
                    readOnly
                  />
                  <span className="inline-flex items-center px-3 text-sm font-medium bg-gray-200 border border-e-0 border-gray-300 rounded-e-lg ">m</span>
                </div>
              </div>
              <div className="me-5 md:col-span-1 sm:mx-5 sm:col-span-2">
                <label className="block mb-2 text-lg font-medium">Lebar</label>
                <div className="flex">
                  <input
                    type="text"
                    name="lebar"
                    id="lebar"
                    className="border border-gray-300 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Lebar ruas jalan"
                    required=""
                    value={lebarRuas}
                    onChange={(e) => {
                      setLebarRuas(e.target.value);
                    }}
                  />
                  <span className="inline-flex items-center px-3 text-sm font-medium bg-gray-200 border border-e-0 border-gray-300 rounded-e-lg ">m</span>
                </div>
              </div>
              <div className="ms-5 md:col-span-1 sm:col-span-2 sm:mx-5">
                <label className="block mb-2 text-lg font-medium">Eksisting Id</label>
                <input
                  type="number"
                  name="eksisting"
                  id="eksisting"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Eksisting Id"
                  required=""
                  value={eksistingId}
                  onChange={(e) => {
                    setEksistingId(e.target.value);
                  }}
                />
              </div>
              <div className="me-5 md:col-span-1 sm:col-span-2 sm:mx-5">
                <label className="block mb-2 text-lg font-medium">Kondisi Id</label>
                <input
                  type="number"
                  name="kondisi"
                  id="kondisi"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Kondisi ruas jalan"
                  required=""
                  value={kondisiId}
                  onChange={(e) => {
                    setKondisiId(e.target.value);
                  }}
                />
              </div>
              <div className="sm:col-span-2 mx-5">
                <label className="block mb-2 text-lg font-medium">Jenis Jalan Id</label>
                <input
                  type="number"
                  name="jenis"
                  id="jenis"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Jenis ruas jalan"
                  required=""
                  value={jenisJalanId}
                  onChange={(e) => {
                    setJenisJalanId(e.target.value);
                  }}
                />
              </div>
              <div className="sm:col-span-2 mx-5">
                <label className="block mb-2 text-lg font-medium">Keterangan</label>
                <input
                  type="text"
                  name="ket"
                  id="ket"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Keterangan"
                  required=""
                  value={keterangan}
                  onChange={(e) => {
                    setKeterangan(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 px-5 object-center mb-4 sm:mb-5">
              <button className="w-auto h-9 rounded-md bg-red-500 text-white font-semibold">Cancel</button>
              <button className="w-auto h-9 rounded-md bg-green-500 text-white font-semibold" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function AddPage() {
  const [token, setToken] = useState();
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      Swal.fire({
        icon: "info",
        title: "Not Authenticated",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        router.push("/login");
      });
    } else {
      setToken(storedToken);
    }
  }, [router]);

  return token ? <Form /> : null;
}