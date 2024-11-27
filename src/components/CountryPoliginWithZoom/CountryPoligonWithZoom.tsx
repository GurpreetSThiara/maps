import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const PolyGon = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [countries, setCountries] = useState("");

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibG92ZXJvc2UxMjM0NSIsImEiOiJjbTNzb2dxZDIwMGpvMmtzY3dmdWN1bTZwIn0.yV8rSqXjiW2Tqzo6Rk01kw";

    const mapInstance = new mapboxgl.Map({
      container: containerRef.current!,
      center: [0, 20],
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 2,
    });

    mapRef.current = mapInstance;

    mapInstance.on("load", () => {
      mapInstance.addLayer(
        {
          id: "country-boundaries",
          source: {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          },
          "source-layer": "country_boundaries",
          type: "fill",
          paint: {
            "fill-color": "#002244",
            "fill-opacity": 0.6,
          },
        },
        "country-label"
      );
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  const handleHighlightCountries = () => {
    if (!mapRef.current) return;
  
    const newCountries = countries
      .split(",")
      .map((country) => country.trim())
      .filter((country) => country.length > 0);
  
    const currentFilter = mapRef.current.getFilter("country-boundaries") as
      | ["in", string, ...string[]]
      | null;
  
    const currentCountries = currentFilter ? currentFilter.slice(2) : [];
    const addedCountries = newCountries.filter(
      (country) => !currentCountries.includes(country)
    );
    const removedCountries = currentCountries.filter(
      (country) => !newCountries.includes(country)
    );

    let updatedFilter = [...currentCountries];
    addedCountries.forEach((country) => updatedFilter.push(country));
    removedCountries.forEach(
      (country) =>
        (updatedFilter = updatedFilter.filter((item) => item !== country))
    );
  
    if (updatedFilter.length > 0) {
      mapRef.current.setFilter("country-boundaries", [
        "in",
        "name_en",
        ...updatedFilter,
      ]);
    } else {
      mapRef.current.setFilter("country-boundaries", null);
    }
 
    if (addedCountries.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
  
      addedCountries.forEach((country) => {
        mapRef.current
          ?.querySourceFeatures("country-boundaries", {
            sourceLayer: "country_boundaries",
            filter: ["==", "name_en", country],
          })
          .forEach((feature) => {
            if (feature.geometry.type === "Polygon") {
              const coords = feature.geometry.coordinates[0];
              coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
            } else if (feature.geometry.type === "MultiPolygon") {
              feature.geometry.coordinates.forEach((polygon) => {
                polygon[0].forEach(([lng, lat]) => bounds.extend([lng, lat]));
              });
            }
          });
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, { padding: 50 });
      }
    } else if (removedCountries.length > 0) {

      const bounds = new mapboxgl.LngLatBounds();
  
 
      const remainingCountries = newCountries.filter(
        (country) => !removedCountries.includes(country)
      );
  
      remainingCountries.forEach((country) => {
        mapRef.current
          ?.querySourceFeatures("country-boundaries", {
            sourceLayer: "country_boundaries",
            filter: ["==", "name_en", country],
          })
          .forEach((feature) => {
            if (feature.geometry.type === "Polygon") {
              const coords = feature.geometry.coordinates[0];
              coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
            } else if (feature.geometry.type === "MultiPolygon") {
              feature.geometry.coordinates.forEach((polygon) => {
                polygon[0].forEach(([lng, lat]) => bounds.extend([lng, lat]));
              });
            }
          });
      });
  
      console.log("Zoom Bounds for Remaining Countries:", bounds);
  
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, { padding: 50 });
      }
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-bold">Highlight Multiple Countries</h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 mb-2 border"
          placeholder="Enter countries separated by commas (e.g., India, Canada)"
          value={countries}
          onChange={(e) => setCountries(e.target.value)}
        />
        <button
          onClick={handleHighlightCountries}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Highlight Countries
        </button>
      </div>
      <div className="h-[50rem] w-[50rem] border" ref={containerRef}></div>
    </div>
  );
};

export default PolyGon;
