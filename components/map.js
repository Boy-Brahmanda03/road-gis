"use client";

import { MapContainer, TileLayer, Polyline, Popup, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { deleteRuasJalan } from "@/lib/road";
import { getMasterRegion } from "@/lib/region";

export default function Map({ centerMap, zoomSize, data, editable = false, onCreated, onEdited, onDelete }) {
  const r = useRouter();
  const [token, setToken] = useState();
  const [goodRoad, setGoodRoad] = useState();
  const [avgRoad, setAvgRoad] = useState();
  const [badRoad, setBadRoad] = useState();
  const [masterDataDesa, setMasterDataDesa] = useState();

  useEffect(() => {
    if (data != null && token != null) {
      getMasterRegion(token).then((data) => setMasterDataDesa(data));
      setGoodRoad(data.filter((road) => road.kondisi_id == 1));
      setAvgRoad(data.filter((road) => road.kondisi_id == 2));
      setBadRoad(data.filter((road) => road.kondisi_id == 3));
    }
  }, [data, token]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // Handle delete event with confirmation
  const handleDelete = (id) => {
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
            // Update the roads data if needed
            const filteredGoodRoads = goodRoad.filter((pos) => pos.id !== id);
            const filteredAvgRoads = avgRoad.filter((pos) => pos.id !== id);
            const filteredBadRoads = badRoad.filter((pos) => pos.id !== id);
            setGoodRoad(filteredGoodRoads);
            setAvgRoad(filteredAvgRoads);
            setBadRoad(filteredBadRoads);
          }
        });
      }
    });
  };

  // Handle edit event
  const handleEdit = (id) => {
    r.push(`/road/edit/${id}`);
  };

  return (
    <MapContainer className="h-full rounded-lg" center={centerMap} zoom={zoomSize} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        {editable && (
          <EditControl
            position="topright"
            onCreated={onCreated}
            onEdited={onEdited}
            onDeleted={onDelete}
            draw={{
              polygon: false,
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
            edit={{
              edit: editable,
              remove: editable,
            }}
          />
        )}
      </FeatureGroup>
      {goodRoad &&
        goodRoad?.length > 0 &&
        goodRoad.map((road, index) => (
          <Polyline key={index} positions={road.decodedPaths} color="green">
            {!editable && (
              <Popup>
                <div>
                  <strong>{road.nama_ruas}</strong>
                  <br />
                  Lokasi: {masterDataDesa?.find((data) => data.id == road.desa_id).desa}
                  <br />
                  Panjang: {road.panjang} meters
                  <br />
                  Lebar: {road.lebar} meters
                  <br />
                  Keterangan: {road.keterangan}
                  <br />
                </div>
                <button
                  className="w-full p-3 my-2 text-white font-medium bg-yellow-500 rounded-md border border-gray-200 hover:bg-yellow-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(road.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full p-3 text-white font-medium bg-red-500 rounded-md hover:bg-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(road.id);
                  }}
                >
                  Delete
                </button>
              </Popup>
            )}
          </Polyline>
        ))}

      {avgRoad &&
        avgRoad?.length > 0 &&
        avgRoad.map((road, index) => (
          <Polyline key={index} positions={road.decodedPaths} color="yellow">
            {!editable && (
              <Popup>
                <div>
                  <strong>{road.nama_ruas}</strong>
                  <br />
                  Lokasi: {masterDataDesa?.find((data) => data.id == road.desa_id).desa}
                  <br />
                  Panjang: {road.panjang} meters
                  <br />
                  Lebar: {road.lebar} meters
                  <br />
                  Keterangan: {road.keterangan}
                  <br />
                </div>
                <button
                  className="w-full p-3 my-2 text-white font-medium bg-yellow-500 rounded-md border border-gray-200 hover:bg-yellow-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(road.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full p-3 text-white font-medium bg-red-500 rounded-md hover:bg-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(road.id);
                  }}
                >
                  Delete
                </button>
              </Popup>
            )}
          </Polyline>
        ))}

      {badRoad &&
        badRoad?.length > 0 &&
        badRoad.map((road, index) => (
          <Polyline key={index} positions={road.decodedPaths} color="red">
            {!editable && (
              <Popup>
                <div>
                  <strong>{road.nama_ruas}</strong>
                  <br />
                  Lokasi: {masterDataDesa?.find((data) => data.id == road.desa_id).desa}
                  <br />
                  Panjang: {road.panjang} meters
                  <br />
                  Lebar: {road.lebar} meters
                  <br />
                  Keterangan: {road.keterangan}
                  <br />
                </div>
                <button
                  className="w-full p-3 my-2 text-white font-medium bg-yellow-500 rounded-md border border-gray-200 hover:bg-yellow-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(road.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full p-3 text-white font-medium bg-red-500 rounded-md hover:bg-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(road.id);
                  }}
                >
                  Delete
                </button>
              </Popup>
            )}
          </Polyline>
        ))}
    </MapContainer>
  );
}
