import React, { memo, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { STORES } from "../../lib/constants";

const Map = () => {
  console.log("Map rendered");
  const [mapStyle, setMapStyle] = useState("mapbox/streets-v11");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibG92ZXJvc2UxMjM0NSIsImEiOiJjbTNzb2dxZDIwMGpvMmtzY3dmdWN1bTZwIn0.yV8rSqXjiW2Tqzo6Rk01kw";

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/streets-v11",

      zoom: 10.12,
    });

    mapRef.current = mapInstance;

    mapInstance.on("load", () => {
      mapInstance.addLayer({
        id: "locations",
        type: "circle",
        source: {
          type: "geojson",
          data: STORES as GeoJSON.FeatureCollection,
        },
        layout: {
          "icon-image": "custom-icon",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
        },
      });

      mapInstance.on("click", "locations", (e) => {
        if (e.features && e.features.length > 0) {
          const { properties } = e.features[0];
          if (e.features[0].geometry.type === "Point") {
            const coordinates = e.features[0].geometry.coordinates.slice();

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            const popupContent = `
            <div>
              <h3>${properties?.address || "No Address Available"}</h3>
              <p>
                ${properties?.city || ""}, ${properties?.state || ""} ${
              properties?.postalCode || ""
            }
              </p>
              <p><strong>Phone:</strong> ${
                properties?.phoneFormatted || "N/A"
              }</p>
              <p><strong>Cross Street:</strong> ${
                properties?.crossStreet || "N/A"
              }</p>
              <p><strong>Country:</strong> ${properties?.country || "N/A"}</p>
            </div>
          `;

            new mapboxgl.Popup()
              .setLngLat({ lng: coordinates[0], lat: coordinates[1] })
              .setHTML(popupContent)
              .addTo(mapInstance);
          }
        }
      });

      // Change cursor to pointer on hover
      mapInstance.on("mouseenter", "locations", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });

      // Reset cursor when leaving the layer
      mapInstance.on("mouseleave", "locations", () => {
        mapInstance.getCanvas().style.cursor = "";
      });
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  const handleMapStyleChange = (style: string) => {
    if (mapRef.current) {
      mapRef.current.setStyle(`mapbox://styles/${style}`);
    }
  };

  return (
    <div className="">
      {/* Dropdown Button */}
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
        >
          Select Map Style
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 z-10 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
            <ul>
              <li>
                <button
                  onClick={() => handleMapStyleChange("mapbox/streets-v11")}
                  className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Streets
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    handleMapStyleChange("mapbox/satellite-streets-v11")
                  }
                  className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Satellite
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMapStyleChange("mapbox/satellite-v9")}
                  className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Satellite (Pure)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMapStyleChange("mapbox/outdoors-v11")}
                  className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Outdoors
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>{" "}
      <div ref={mapContainerRef} className="h-[50rem] w-[50rem] bg-black" />;
    </div>
  );
};

export default memo(Map);
