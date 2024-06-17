"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/card";
import Navbar from "@/components/navbar";
import { deleteRuasJalan, getJenisJalan, getKondisiJalan, getMasterRuasJalan, getPerkerasanEksisting } from "@/lib/road";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import PieChart from "@/components/pieChart";
import BarChart from "@/components/barChart";
import { getMasterRegion } from "@/lib/region";

export default function MasterPage() {
  const [token, setToken] = useState(null);
  const [roadData, setRoadData] = useState([]);
  const [kondisiJalan, setKondisiJalan] = useState([]);
  const [perkerasanJalan, setPerkerasanJalan] = useState([]);
  const [jenisJalan, setJenisJalan] = useState([]);
  const [kondisiBagus, setKondisiBagus] = useState(0);
  const [kondisiSedang, setKondisiSedang] = useState(0);
  const [kondisiRusak, setKondisiRusak] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [countPerkerasan, setCountPerkerasan] = useState();
  const [countJenis, setCountJenis] = useState();
  const [masterDataDesa, setMasterDataDesa] = useState();

  const r = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getMasterRuasJalan(token).then((data) => setRoadData(data));
      getMasterRegion(token).then((data) => setMasterDataDesa(data));
    }
  }, [token]);

  console.log(masterDataDesa);

  useEffect(() => {
    if (token) {
      getKondisiJalan(token).then((data) => {
        setKondisiJalan(data);
      });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getPerkerasanEksisting(token).then((data) => {
        setPerkerasanJalan(data);
      });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getJenisJalan(token).then((data) => {
        setJenisJalan(data);
      });
    }
  }, [token]);

  // Calculate kondisi jalan statistics
  useEffect(() => {
    if (roadData) {
      //define based on condition road
      const goodRoad = roadData.filter((data) => data.kondisi_id === 1).length;
      const avgRoad = roadData.filter((data) => data.kondisi_id === 2).length;
      const badRoad = roadData.filter((data) => data.kondisi_id === 3).length;

      setKondisiBagus(goodRoad);
      setKondisiSedang(avgRoad);
      setKondisiRusak(badRoad);

      let jumlahJenisId = {
        1: 0,
        2: 0,
        3: 0,
      };

      roadData.forEach((road) => {
        if (jumlahJenisId.hasOwnProperty(road.jenisjalan_id)) {
          jumlahJenisId[road.jenisjalan_id]++;
        }
      });

      let semuaJenisId = [1, 2, 3];
      let hasilArrayJenis = semuaJenisId.map((id) => jumlahJenisId[id]);
      console.log(hasilArrayJenis);
      setCountJenis(hasilArrayJenis);

      // Inisialisasi objek untuk menyimpan jumlah jalan per eksisting_id
      let jumlahEksistingId = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
      };

      // Iterasi melalui array jalan-jalan untuk menghitung jumlah
      roadData.forEach((road) => {
        if (jumlahEksistingId.hasOwnProperty(road.eksisting_id)) {
          jumlahEksistingId[road.eksisting_id]++;
        }
      });

      // Memastikan semua eksisting_id termasuk dalam hasil akhir
      let semuaEksistingId = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let hasilArray = semuaEksistingId.map((id) => jumlahEksistingId[id]);
      setCountPerkerasan(hasilArray);
    }
  }, [roadData]);

  // Handle page change
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Determine the data to be displayed on the current page
  const indexedRoadData = roadData.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  const displayData = indexedRoadData.slice(currentPage * 5, (currentPage + 1) * 5);
  const pageCount = Math.ceil(roadData.length / 5);

  console.log(displayData);

  // Add road handler
  const addHandler = (e) => {
    e.preventDefault();
    r.push("/road/add");
  };

  // Edit road handler
  const editHandler = (id) => {
    r.push(`/road/edit/${id}`);
  };

  // Delete road handler
  const deleteHandler = (id) => {
    if (token) {
      Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete this item?",
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: "Delete",
      }).then((result) => {
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
                title: "Success!",
                text: `Successfully deleted road ${data.ruasjalan.nama_ruas}`,
                icon: "success",
              });
              const filteredRoads = roadData.filter((pos) => pos.id !== id);
              setRoadData(filteredRoads);
            }
          });
        }
      });
    }
  };

  if (!roadData || roadData.length === 0) {
    return <div>Loading...</div>;
  }

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
        <div className="grid grid-cols-2 mb-4 gap-4">
          <div className="flex justify-center border border-gray-200 rounded-md p-5 shadow-sm">
            <PieChart
              data={[
                { label: "Provinsi", value: countJenis[2] },
                { label: "Kabupaten", value: countJenis[1] },
                { label: "Desa", value: countJenis[0] },
              ]}
            />
          </div>
          <div className="flex justify-center border border-gray-200 rounded-md p-5 shadow-sm">
            <BarChart valueData={countPerkerasan} labelData={perkerasanJalan.map((data) => data.eksisting)} />
          </div>
        </div>
        <div className="justify-center border border-gray-200 rounded-md p-5 shadow-sm mb-7">
          <h1 className="text-center font-bold">Kondisi Jalan</h1>
          <div className="flex p-4 gap-6">
            <Card title={"Bagus"} data={kondisiBagus} type={"bagus"} />
            <Card title={"Sedang"} data={kondisiSedang} type={"sedang"} />
            <Card title={"Rusak"} data={kondisiRusak} type={"rusak"} />
          </div>
        </div>
        <table className="w-full text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center">
            <tr>
              <th scope="col" className="px-2 py-3">
                No
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
            {displayData.map((road) => (
              <tr key={road.id} className="bg-white border-b">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {road.index}
                </th>
                <td className="px-4 py-4">{road.nama_ruas}</td>
                <td className="px-4 py-4">{masterDataDesa?.find((data) => data.id == road.desa_id).desa}</td>
                <td className="px-4 py-4">{road.panjang}</td>
                <td className="px-4 py-4">{road.lebar}</td>
                <td className="px-4 py-4">{kondisiJalan.find((data) => data.id === road.kondisi_id)?.kondisi || ""}</td>
                <td className="px-4 py-4">{perkerasanJalan.find((data) => data.id === road.eksisting_id)?.eksisting || ""}</td>
                <td className="px-4 py-4">{jenisJalan.find((data) => data.id === road.jenisjalan_id)?.jenisjalan || ""}</td>
                <td className="px-4 py-4">{road.keterangan}</td>
                <td className="px-4 py-4">
                  <button className="py-2 w-20 bg-yellow-400 rounded-lg text-white hover:bg-yellow-700" onClick={() => editHandler(road.id)}>
                    Edit
                  </button>
                </td>
                <td className="px-4 py-4">
                  <button className="py-2 w-20 bg-red-500 rounded-lg text-white hover:bg-red-700" onClick={() => deleteHandler(road.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center m-4 items-center"}
          subContainerClassName={"pages pagination"}
          activeClassName={"text-white bg-blue-500 py-2 px-3 border rounded text-center mx-6"}
          disabledClassName={"text-gray-300 py-2 px-3 border rounded text-center mx-6"}
          previousClassName={"py-2 px-3 m-4 border rounded bg-gray-200"}
          nextClassName={"py-2 px-3 m-4 border rounded bg-gray-200"}
          pageClassName={"page-item mx-2"}
        />
      </div>
    </div>
  );
}
