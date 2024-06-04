"use client";

import Navbar from "@/components/navbar";
import { deleteRuasJalan, getJenisJalan, getKondisiJalan, getMasterRuasJalan, getPerkerasanEksisting } from "@/lib/road";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function MasterPage() {
  const [token, setToken] = useState();
  const [roadData, setRoadData] = useState([]);
  const [kondisiJalan, setKondisiJalan] = useState([]);
  const [perkerasanJalan, setPerkerasanJalan] = useState([]);
  const [jenisJalan, setJenisJalan] = useState([]);
  const r = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token != null || token != undefined) {
      getMasterRuasJalan(token).then((data) => setRoadData(data));
    }
  }, [token]);

  useEffect(() => {
    if (token != null || token != undefined) {
      getKondisiJalan(token).then((data) => {
        setKondisiJalan(data);
      });
    }
  }, [token]);

  useEffect(() => {
    if (token != null || token != undefined) {
      getPerkerasanEksisting(token).then((data) => {
        setPerkerasanJalan(data);
      });
    }
  }, [token]);

  useEffect(() => {
    if (token != null || token != undefined) {
      getJenisJalan(token).then((data) => {
        setJenisJalan(data);
      });
    }
  }, [token]);

  const addHandler = (e) => {
    e.preventDefault();
    r.push("/road/add");
  };

  const deleteHandler = (id) => {
    if (token != null || token != undefined) {
      Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete this item?",
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: "Delete",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isDenied) {
          deleteRuasJalan(token, id).then((data) => {
            if (data.status === "failed") {
              Swal.fire({
                title: "Failed!",
                text: data.message,
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "Succces!",
                text: `Succesfully deleted road ${data.ruasjalan.nama_ruas}`,
                icon: "success",
              });
              const filteredRoads = roadData.filter((pos) => {
                return pos.id !== id;
              });
              setRoadData(filteredRoads);
            }
          });
        }
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative overflow-x-auto p-5 lg:mx-20">
        <div className="grid grid-cols-3 mb-5">
          <div className="col-span-2">
            <h1 className="mt-5 text-2xl font-semibold text-left rtl:text-right text-gray-900 bg-white mb-5">Master Data Road</h1>
          </div>
          <div className="flex justify-end items-center col-span-1">
            <button className="w-20 h-11 col-span-1 shadow-sm rounded-lg border border-gray-200 hover:shadow-lg" onClick={addHandler}>
              Add
            </button>
          </div>
        </div>
        <table className="w-full text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center">
            <tr>
              <th scope="col" className="px-2 py-3">
                Id
              </th>
              <th scope="col" className="px-4 py-3">
                Nama
              </th>
              <th scope="col" className="px-4 py-3">
                Letak
              </th>
              <th scope="col" className="px-4 py-3">
                Panjang
              </th>
              <th scope="col" className="px-4 py-3">
                Lebar
              </th>
              <th scope="col" className="px-4 py-3">
                Kondisi
              </th>
              <th scope="col" className="px-4 py-3">
                Perkerasan
              </th>
              <th scope="col" className="px-4 py-3">
                Jenis
              </th>
              <th scope="col" className="px-4 py-3">
                Keterangan
              </th>
              <th scope="col" className="px-4 py-3">
                Edit
              </th>
              <th scope="col" className="px-4 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {roadData &&
              roadData.map((road) => (
                <tr key={road.id} className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {road.id}
                  </th>
                  <td className="px-4 py-4">{road.nama_ruas}</td>
                  <td className="px-4 py-4">{road.desa_id}</td>
                  <td className="px-4 py-4">{road.panjang}</td>
                  <td className="px-4 py-4">{road.lebar}</td>
                  <td className="px-4 py-4">
                    {kondisiJalan.length > 0 &&
                      kondisiJalan.find((data) => {
                        return data.id === road.kondisi_id;
                      }).kondisi}
                  </td>
                  <td className="px-4 py-4">
                    {perkerasanJalan.length > 0 &&
                      perkerasanJalan.find((data) => {
                        return data.id === road.eksisting_id;
                      }).eksisting}
                  </td>
                  <td className="px-4 py-4">
                    {jenisJalan.length > 0 &&
                      jenisJalan.find((data) => {
                        return data.id === road.jenisjalan_id;
                      }).jenisjalan}
                  </td>
                  <td className="px-4 py-4">{road.keterangan}</td>
                  <td className="px-4 py-4">
                    <button className="py-2 w-20 bg-yellow-400 rounded-lg text-white hover:bg-yellow-700">Edit</button>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      className="py-2 w-20 bg-red-500 rounded-lg text-white hover:bg-red-700"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteHandler(road.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
