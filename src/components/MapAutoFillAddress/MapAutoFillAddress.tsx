import React, { memo, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { STORES } from "../../lib/constants";
import { AddressAutofillFeild } from "../AddressAutoFill/AddressAutoFillFeild";




const MapAutoFillAddress = () => {
    const [ c , setC] = useState()
  console.log("Map rendered");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [address, setAddress] = useState("");
  console.log(c)

  
  
  const [city, setCity] = useState("");




//   useEffect(() => {
//     mapboxgl.accessToken =
//       "pk.eyJ1IjoibG92ZXJvc2UxMjM0NSIsImEiOiJjbTNzb2dxZDIwMGpvMmtzY3dmdWN1bTZwIn0.yV8rSqXjiW2Tqzo6Rk01kw";

//     const mapInstance = new mapboxgl.Map({
//       container: mapContainerRef.current!,
//       center: [-74.0242, 40.6941],
//       style: "mapbox://styles/mapbox/streets-v11",

//       zoom: 10.12,
//     });

//     mapRef.current = mapInstance;

//     mapInstance.on("load", () => {
//       // Add a symbol layer for marked locations
//       mapInstance.addLayer({
//         id: "locations",
//         type: "circle",
//         source: {
//           type: "geojson",
//           data: STORES as GeoJSON.FeatureCollection, // Your STORES data
//         },
//         layout: {
//           "icon-image": "custom-icon", // Use a custom marker icon
//           "icon-size": 0.5,
//           "icon-allow-overlap": true,
//         },
//       });

//       // Add a click event to display a popup for locations
//       mapInstance.on("click", "locations", (e) => {
//         const { properties } = e.features[0]; // Extract properties of the clicked feature
//         const coordinates = e.features[0].geometry.coordinates.slice(); // Get coordinates

//         // Adjust coordinates for overlapping popups on the same location
//         while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//           coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//         }

//         // Create popup content from the feature properties
//         const popupContent = `
//             <div>
//               <h3>${properties?.address || "No Address Available"}</h3>
//               <p>
//                 ${properties?.city || ""}, ${properties?.state || ""} ${
//           properties?.postalCode || ""
//         }
//               </p>
//               <p><strong>Phone:</strong> ${
//                 properties?.phoneFormatted || "N/A"
//               }</p>
//               <p><strong>Cross Street:</strong> ${
//                 properties?.crossStreet || "N/A"
//               }</p>
//               <p><strong>Country:</strong> ${properties?.country || "N/A"}</p>
//             </div>
//           `;

//         // Create and add the popup
//         new mapboxgl.Popup()
//           .setLngLat(coordinates) // Set the popup location
//           .setHTML(popupContent) // Set the popup content
//           .addTo(mapInstance); // Add the popup to the map
//       });

//       // Change cursor to pointer on hover
//       mapInstance.on("mouseenter", "locations", () => {
//         mapInstance.getCanvas().style.cursor = "pointer";
//       });

//       // Reset cursor when leaving the layer
//       mapInstance.on("mouseleave", "locations", () => {
//         mapInstance.getCanvas().style.cursor = "";
//       });
//     });

//     return () => {
//       mapInstance.remove();
//     };
//   }, []);

  const handleMapStyleChange = (style) => {
    if (mapRef.current) {
      mapRef.current.setStyle(`mapbox://styles/${style}`);
    }
  };



  const handleAutofillRetrieve = (response: any) => {
    console.log("ddddddddfffffffffffffffffffffffffff")
    const { center } = response; // center contains lat, long
    const lat = center[1];
    const long = center[0];

    setC(center)
  
    console.log("Selected location:", response);
    console.log("Latitude:", lat);
    console.log("Longitude:", long);
    setCity(response.features[0]);
    console.log(response.features)
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
      </div>
  <form>
 <AddressAutofillFeild />
  </form>
      <div ref={mapContainerRef} className="h-[50rem] w-[50rem] bg-black" />;
    </div>
  );
};

export default memo(MapAutoFillAddress);
