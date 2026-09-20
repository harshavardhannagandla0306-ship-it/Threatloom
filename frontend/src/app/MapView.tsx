/// <reference types="google.maps" />

"use client";

import { useEffect, useRef } from "react";
import {
  setOptions,
  importLibrary,
} from "@googlemaps/js-api-loader";

type LocationPoint = {
  ip: string;
  latitude: number;
  longitude: number;
  label?: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  organization?: string;
  asn?: string;
  role?: string;
};

type MapViewProps = {
  latitude?: number;
  longitude?: number;
  label?: string;
  locations?: LocationPoint[];
};

export default function MapView({
  latitude,
  longitude,
  label = "Candidate Origin",
  locations = [],
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return;

      const apiKey =
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error(
          "Google Maps API key is missing."
        );
        return;
      }

      try {
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        const { Map } =
          (await importLibrary("maps")) as google.maps.MapsLibrary;

        const { AdvancedMarkerElement } =
          (await importLibrary("marker")) as google.maps.MarkerLibrary;

        let points = locations.filter(
          (location) =>
            Number.isFinite(location.latitude) &&
            Number.isFinite(location.longitude)
        );

        if (points.length === 0 && latitude != null && longitude != null) {
          points = [
            {
              ip: "origin",
              latitude,
              longitude,
              label,
            },
          ];
        }

        if (points.length === 0) return;

        const firstPoint = {
          lat: points[0].latitude,
          lng: points[0].longitude,
        };

        const map = new Map(mapRef.current, {
          center: firstPoint,
          zoom: points.length === 1 ? 10 : 4,
          mapId: "MAILTRACE_MAP",
        });

const bounds = new google.maps.LatLngBounds();

const infoWindow = new google.maps.InfoWindow();

points.forEach((point) => {
          const position = {
            lat: point.latitude,
            lng: point.longitude,
          };

          bounds.extend(position);

const markerElement = document.createElement("div");

markerElement.style.width = "18px";
markerElement.style.height = "18px";
markerElement.style.borderRadius = "50%";
markerElement.style.border = "3px solid white";
markerElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
markerElement.style.background =
  point.role === "Candidate Origin"
    ? "#ef4444"
    : point.role === "Suspicious Infrastructure"
    ? "#f97316"
    : "#3b82f6";

const marker = new AdvancedMarkerElement({
  map,
  position,
  title: point.label || point.ip,
  content: markerElement,
});



marker.addListener("click", () => {
  infoWindow.setContent(`
    <div style="
      padding: 10px;
      color: #111827;
      min-width: 190px;
      font-family: Arial, sans-serif;
      line-height: 1.45;
    ">
      <div style="
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 6px;
      ">
        ${point.role === "Candidate Origin"
          ? "🔴 Candidate Origin"
          : point.role === "Suspicious Infrastructure"
          ? "🟠 Suspicious Infrastructure"
          : "🔵 Relay Server"}
      </div>

      <div style="font-size: 13px;">
        <strong>IP:</strong> ${point.ip}
      </div>

      <div style="font-size: 13px;">
        <strong>Location:</strong>
        ${point.city || "Unknown"}, ${point.country || "Unknown"}
      </div>

      <div style="font-size: 13px;">
        <strong>ISP:</strong> ${point.isp || "Unknown"}
      </div>

      <div style="font-size: 13px;">
        <strong>ASN:</strong> ${point.asn || "Unknown"}
      </div>
    </div>
  `);

  infoWindow.open({
    map,
    anchor: marker,
  });
});
        });
        if (points.length > 1) {
  new google.maps.Polyline({
    path: points.map((point) => ({
      lat: point.latitude,
      lng: point.longitude,
    })),
    geodesic: true,
    map,
    strokeOpacity: 0.8,
    strokeWeight: 3,
  });
}

        if (points.length > 1) {
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error(
          "Google Maps failed to load:",
          error
        );
      }
    };

    loadMap();
  }, [latitude, longitude, label, locations]);

  return (
    <div
      ref={mapRef}
      className="h-[400px] w-full overflow-hidden rounded-xl"
    />
  );
}