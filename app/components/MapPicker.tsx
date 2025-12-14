"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon error Leaflet di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TELKOM_CENTER: [number, number] = [-6.973003, 107.630347];

// Komponen klik peta
function LocationPicker({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  onSelectLocation,
}: {
  onSelectLocation: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={TELKOM_CENTER}
      zoom={16}
      className="h-[360px] w-full rounded-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marker Telkom */}
      <Marker position={TELKOM_CENTER}>
        <Popup>Telkom University Bandung</Popup>
      </Marker>

      {/* Area Kampus */}
      <Circle
        center={TELKOM_CENTER}
        radius={600}
        pathOptions={{ color: "red" }}
      />

      {/* Klik lokasi */}
      <LocationPicker onSelect={onSelectLocation} />
    </MapContainer>
  );
}
