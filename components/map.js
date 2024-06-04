"use client";

import { MapContainer, TileLayer, Polyline, useMapEvents, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { deleteRuasJalan, getMasterRuasJalan } from "@/lib/road";
import polyline from "@mapbox/polyline";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const getData = async (token) => {
  const data = await getMasterRuasJalan(token);
  return data;
};

const markerIcon = L.icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
  iconSize: [24, 24],
});

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export default function Map({ centerMap, zoomSize, editable, onClick }) {
  const r = useRouter();
  //for new polygon
  const [positions, setPositions] = useState([]);
  //token
  const [token, setToken] = useState();
  //for polygon in database
  const [roads, setRoads] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token != null && token != undefined) {
      getData(token).then((data) => {
        // Decode the polyline paths and store them
        const decodedRoads = data.map((ruas) => ({
          ...ruas,
          decodedPaths: polyline.decode(ruas.paths),
        }));

        decodedRoads.map((road) => {
          setRoads((prevDecode) => [...prevDecode, road]);
        });
      });
    }
  }, [token, editable]);

  const handleMapClick = (position) => {
    setPositions((prevPositions) => [...prevPositions, position]);
    if (onClick) {
      onClick(position);
    }
  };

  const handleDelete = (token, id) => {
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
            const filteredRoads = roads.filter((pos) => {
              return pos.id !== id;
            });
            setRoads(filteredRoads);
          }
        });
      }
    });
  };

  return (
    <>
      <MapContainer className="h-full rounded-lg" center={centerMap} zoom={zoomSize} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {editable && <ClickHandler onClick={handleMapClick} />}
        {roads.map((road, index) => (
          <Polyline key={index} positions={road.decodedPaths} color="green">
            {!editable && (
              <Popup>
                <div>
                  <strong>{road.nama_ruas}</strong>
                  <br />
                  Lokasi: {road.desa_id}
                  <br />
                  Panjang: {road.panjang} meters
                  <br />
                  Lebar: {road.lebar} meters
                  <br />
                  Keterangan: {road.keterangan}
                  <br />
                </div>
                <button className="w-full p-3 my-2 text-white font-medium bg-yellow-500 rounded-md border border-gray-200 hover:bg-yellow-700">Edit</button>
                <button
                  className="w-full p-3 text-white font-medium bg-red-500 rounded-md hover:bg-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(token, road.id);
                  }}
                >
                  Delete
                </button>
              </Popup>
            )}
          </Polyline>
        ))}
        {positions.map((pos, index) => (
          <Marker key={index} position={pos} icon={markerIcon} />
        ))}
        <Polyline positions={positions} color="blue" />
      </MapContainer>
    </>
  );
}
