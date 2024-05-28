"use client";

import { MapContainer, TileLayer, Polyline, useMapEvents, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { deleteRuasJalan, getMasterRuasJalan } from "@/lib/road";
import polyline from "@mapbox/polyline";
import { useRouter } from "next/navigation";

const getData = async (token) => {
  const data = await getMasterRuasJalan(token);
  console.log(data);
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
    if (token != null && token != undefined && !editable) {
      getData(token).then((data) => {
        console.log(data);
        // Menyiapkan array untuk menyimpan hasil dekode
        // Melakukan iterasi pada setiap objek dalam array ruasjalan
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

  const handleDelete = async (token, id) => {
    const res = await deleteRuasJalan(token, id);
    if (res.status === "failed") {
      alert(res.message);
    } else {
      alert(res.status);
      const filteredRoads = roads.filter((pos) => {
        console.log(id);
        console.log(pos);
        return pos.id !== id;
      });
      setRoads(filteredRoads);
      r.push("/");
    }
  };

  return (
    <>
      <MapContainer className="h-full rounded-lg" center={centerMap} zoom={zoomSize} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {editable && <ClickHandler onClick={handleMapClick} />}
        {roads.map((road, index) => (
          <Polyline key={index} positions={road.decodedPaths} color="green">
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
