"use client";

import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { addRuasJalan, getJenisJalan, getKondisiJalan, getPerkerasanEksisting, getRuasJalanById } from "@/lib/road";
import Image from "next/image";
import close_icon from "/public/close-icon.png";
import Dropdown from "@/components/dropdown";
import DropdownRoad from "@/app/road/dropdownRoad";

const Map = dynamic(() => import("@/app/road/edit/[id]/mapEdit"), { ssr: false });

const calculateDistance = (positions) => {
  let total = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    const marker = L.latLng(positions[i]);
    const nextMarker = L.latLng(positions[i + 1]);
    total += marker.distanceTo(nextMarker);
  }
  return total;
};

const Form = ({ dataDetail }) => {
  const dataDetailDecode = { ...dataDetail, decodedPaths: polyline.decode(dataDetail.paths) };
  const [initialData, setInitialData] = useState(dataDetailDecode);
  console.log(dataDetailDecode.decodedPaths);
  const [initialPaths, setInitialPaths] = useState(dataDetailDecode.decodedPaths);
  console.log("intial paths : ", initialPaths);
  console.log("intial data : ", initialData);

  const handleCreated = (e) => {
    const newPolyline = layer.getLatLngs();
    setInitialPaths([...initialPaths, newPolyline]);
  };

  return (
    <div className="grid grid-cols-4 gap-3 h-fit lg:mx-20 px-4 pt-4 pb-4">
      <div className="w-full h-screen rounded-lg col-span-2">
        <Map initialPaths={initialPaths} />
      </div>
      <div className="col-span-2 mx-auto w-full">
        <div className="bg-white shadow-lg rounded-lg flex-1 border border-gray-200">
          <div className="flex mb-3">
            <h2 className="flex-1 font-sans font-bold text-3xl ms-5 my-5 text-black">Edit Road Data</h2>
            <button className="me-8 justify-end items-end">
              <Image src={close_icon} className="size-6" alt="Close icons created by ariefstudio - Flaticon" width={300} height={300} />
            </button>
          </div>
          {/* <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
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
              <label className="block mb-2 text-lg font-medium">Letak Ruas Jalan</label>
              <Dropdown handleSelect={handleVillageSelect} title={"Provinsi"} />
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
              <label className="block mb-2 text-lg font-medium">Perkerasan Jalan</label>
              <DropdownRoad data={eksisting} handleSelected={handleEksistingSelect} title={"Jenis Pekerasan"} />
            </div>
            <div className="me-5 md:col-span-1 sm:col-span-2 sm:mx-5">
              <label className="block mb-2 text-lg font-medium">Kondisi Jalan</label>
              <DropdownRoad data={kondisi} handleSelected={handleKondisiSelect} title={"Kondisi jalan"} />
            </div>
            <div className="sm:col-span-2 mx-5">
              <label className="block mb-2 text-lg font-medium">Jenis Jalan</label>
              <DropdownRoad data={jenisJalan} handleSelected={handleJenisSelect} title={"Jenis Jalan"} />
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
            <button className="w-auto h-9 rounded-md bg-green-500 text-white font-semibold">Save</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default function EditPage({ params }) {
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const router = useRouter();
  const [roadData, setRoadData] = useState();

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

  useEffect(() => {
    setId(params.id);
  }, [params.id]);

  useEffect(() => {
    if (token != null || token != undefined) {
      getRuasJalanById(token, id).then((data) => {
        setRoadData(data);
      });
    }
  }, [token, id]);

  return (
    <>
      {token ? (
        <div>
          <Navbar />
          {roadData && <Form dataDetail={roadData} />}
        </div>
      ) : (
        <p>Token Tidak Ditemukan</p>
      )}
    </>
  );
}
