"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { deleteRuasJalan, getMasterRuasJalan } from "@/lib/road";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const markerIcon = L.icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
  iconSize: [24, 24],
});

export default function Map({ centerMap, zoomSize, data, editable = false, onClick }) {
  const r = useRouter();
  //adding aditional marker
  const [positions, setPositions] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  if (onClick) {
    if (positions.length > 0) {
      onClick(positions);
    }
  }

  const handleMarkerClick = () => {
    console.log("Marker clicked, positions before removal:", positions);
    if (positions.length > 0) {
      setPositions((prevPositions) => prevPositions.slice(0, -1));
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
            setRoads((prevRoads) => prevRoads.filter((road) => road.id !== id));
          }
        });
      }
    });
  };

  const handleEdit = (id) => {
    r.push(`/road/edit/${id}`);
  };

  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polyline") {
      const latlngs = layer.getLatLngs();
      setPositions(latlngs);
    }
  };

  // Handle edited layers
  const handleEdited = (e) => {
    const layers = e.layers;
    const updatedPositions = [];

    layers.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        updatedPositions.push(layer.getLatLngs());
      }
    });

    if (updatedPositions.length > 0) {
      setPositions(updatedPositions[0]);
      if (onSave) {
        onSave(updatedPositions[0]);
      }
    }
  };

  return (
    <MapContainer className="h-full rounded-lg" center={centerMap} zoom={zoomSize} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        {editable && (
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={() => {
              handleEdited
            }}
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
      {data &&
        data.length > 0 &&
        data.map((road, index) => (
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
                    handleDelete(token, road.id);
                  }}
                >
                  Delete
                </button>
              </Popup>
            )}
          </Polyline>
        ))}
      {editable && 
        positions.map((pos, index) => (
          <Marker
            key={index}
            position={pos}
            icon={markerIcon}
            eventHandlers={{
              click: () => {
                console.log(`Marker at index ${index} clicked`); // Debug log
                handleMarkerClick();
              },
            }}
          />
        ))}
        <Polyline positions={positions} color="blue" />
    </MapContainer>
  );
}
