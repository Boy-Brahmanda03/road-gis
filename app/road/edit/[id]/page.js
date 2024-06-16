"use client";

import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { editRuasJalan, getJenisJalan, getKondisiJalan, getPerkerasanEksisting, getRuasJalanById } from "@/lib/road";
import Image from "next/image";
import L from "leaflet";
import close_icon from "/public/close-icon.png";
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
  const [initialPaths, setInitialPaths] = useState(dataDetailDecode.decodedPaths);
  const [token, setToken] = useState();
  const [distance, setDistance] = useState(initialData.panjang);
  //polyline encoded
  const [encodePos, setEncodePos] = useState(initialData.paths);
  const [kodeRuas, setKodeRuas] = useState(initialData.kode_ruas);
  const [namaRuas, setNamaRuas] = useState(initialData.nama_ruas);
  const [lebarRuas, setLebarRuas] = useState(initialData.lebar);
  const [eksistingId, setEksistingId] = useState(initialData.eksisting_id);
  const [eksisting, setEksisting] = useState([]);
  const [kondisiId, setKondisiId] = useState(initialData.kondisi_id);
  const [kondisi, setKondisi] = useState([]);
  const [jenisJalanId, setJenisJalanId] = useState(initialData.jenisjalan_id);
  const [jenisJalan, setJenisJalan] = useState([]);
  const [keterangan, setKeterangan] = useState(initialData.keterangan);

  const filteredEksisting = eksisting.find((item) => item.id === eksistingId);
  const filteredJenis = jenisJalan.find((item) => item.id === jenisJalanId);
  const filteredKondisi = kondisi.find((item) => item.id === kondisiId);
  const r = useRouter();

  useEffect(() => {
    if (initialPaths && initialPaths.length > 0) {
      const encodePositions = polyline.encode(initialPaths);
      setEncodePos(encodePositions);

      const length = calculateDistance(initialPaths);
      console.log("Distance:", length);
      setDistance(length);
    }
  }, [initialPaths]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token != null && token != undefined) {
      getPerkerasanEksisting(token).then((data) => {
        const transData = data.map((item) => ({
          id: item.id,
          value: item.eksisting,
        }));
        setEksisting(transData);
        console.log(transData);
      });

      getKondisiJalan(token).then((data) => {
        const transData = data.map((item) => ({
          id: item.id,
          value: item.kondisi,
        }));
        setKondisi(transData);
      });

      getJenisJalan(token).then((data) => {
        const transData = data.map((item) => ({
          id: item.id,
          value: item.jenisjalan,
        }));
        setJenisJalan(transData);
      });
    }
  }, [token]);

  const saveHandler = async (e) => {
    e.preventDefault();
    console.log(token, encodePos, kodeRuas, namaRuas, distance.toFixed(2), lebarRuas, eksistingId, kondisiId, jenisJalanId, keterangan);
    const result = await editRuasJalan(token, initialData.id, encodePos, initialData.desa_id, kodeRuas, namaRuas, distance.toFixed(2), lebarRuas, eksistingId, kondisiId, jenisJalanId, keterangan);
    console.log(result);
    if (result.code == 200) {
      Swal.fire({
        title: "Succces!",
        text: `Succesfully edit road ${result.ruasjalan.nama_ruas}`,
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          r.back();
        }
      });
    } else {
      Swal.fire({
        title: "Failed!",
        text: `Failed create road`,
        icon: "error",
      });
    }
  };

  const handleClose = () => {
    r.back();
  };

  const handleEksistingSelect = (value) => {
    setEksistingId(value);
  };

  const handleKondisiSelect = (value) => {
    console.log(value);
    setKondisiId(value);
  };

  const handleJenisSelect = (value) => {
    setJenisJalanId(value);
  };

  return (
    <div className="grid grid-cols-4 gap-3 h-fit lg:mx-20 px-4 pt-4 pb-4">
      <div className="w-full h-screen rounded-lg col-span-2">
        <Map initialPaths={initialPaths} setInitialPaths={setInitialPaths} />
      </div>
      <div className="col-span-2 mx-auto w-full">
        <div className="bg-white shadow-lg rounded-lg flex-1 border border-gray-200">
          <div className="flex mb-3">
            <h2 className="flex-1 font-sans font-bold text-3xl ms-5 my-5 text-black">Edit Road Data</h2>
            <button className="me-8 justify-end items-end" onClick={handleClose}>
              <Image src={close_icon} className="size-6" alt="Close icons created by ariefstudio - Flaticon" width={300} height={300} />
            </button>
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
              <label className="block mb-2 text-lg font-medium">Perkerasan Jalan</label>
              <DropdownRoad data={eksisting} handleSelected={handleEksistingSelect} title={filteredEksisting?.value} initialValue={filteredEksisting?.value} />
            </div>
            <div className="me-5 md:col-span-1 sm:col-span-2 sm:mx-5">
              <label className="block mb-2 text-lg font-medium">Kondisi Jalan</label>
              <DropdownRoad data={kondisi} handleSelected={handleKondisiSelect} title={filteredKondisi?.value} initialValue={filteredKondisi?.value} />
            </div>
            <div className="sm:col-span-2 mx-5">
              <label className="block mb-2 text-lg font-medium">Jenis Jalan</label>
              <DropdownRoad data={jenisJalan} handleSelected={handleJenisSelect} title={filteredJenis?.value} initialValue={filteredJenis?.value} />
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
            <button className="w-auto h-9 rounded-md bg-green-500 text-white font-semibold" onClickCapture={saveHandler}>
              Save
            </button>
          </div>
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
