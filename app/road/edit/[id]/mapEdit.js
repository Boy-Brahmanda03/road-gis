import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup, Polyline } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const MapComponent = ({ initialPaths }) => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (initialPaths && initialPaths.length > 0) {
      const initialFeature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: initialPaths,
        },
      };
      setFeatures([initialFeature]);
    }
  }, [initialPaths]);

  return (
    <MapContainer center={[initialPaths[0][0], initialPaths[0][1]]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={(e) => {
            const layer = e.layer;
            const newFeature = layer.toGeoJSON();
            setFeatures([...features, newFeature]);
          }}
          onEdited={(e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
              const updatedFeature = layer.toGeoJSON();
              setFeatures(features.map((f) => (f.id === updatedFeature.id ? updatedFeature : f)));
            });
          }}
          onDeleted={(e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
              const deletedFeature = layer.toGeoJSON();
              setFeatures(features.filter((f) => f.id !== deletedFeature.id));
            });
          }}
          draw={{
            polygon: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
        />
        {features.map((feature, index) => feature.geometry.type === "LineString" && <Polyline key={index} positions={feature.geometry.coordinates.map((coord) => [coord[0], coord[1]])} />)}
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;
