"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function MapEdit({ centerMap, zoomSize, data, editable = false, onCreated, onEdited, onDelete }) {
  const r = useRouter();
  const [token, setToken] = useState();

  const [mapData, setData] = useState([data]);

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
      {data && <Polyline positions={data.decodedPaths} color="green"></Polyline>}
    </MapContainer>
  );
}
