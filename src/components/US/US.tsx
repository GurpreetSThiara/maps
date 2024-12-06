import { Map, GeoJSONSource } from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { USA_DATA } from "@/lib/usData";
import SearchInput from "../Input/SearchInput";
import { getZipCodeCoordinates, getZipCodeData } from "@/utils/dbUtils";
import { useDispatch, useSelector } from "react-redux";
import { setZipCodes, setZipData } from "@/redux/reducers/ZipDataSlice";

import { RootState } from "@/redux/store"; // Assuming you have a root state type
import ZipData from "./ZIpData";

interface LocationInfo {
  country?: string
  state?: string
  postcode?: string
}

const USMAP: React.FC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const zipData = useSelector((state: any) => state.zipdata.zipdata);
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({})



  const zipCodes = useSelector((state: RootState) => state.zipdata.zipCodes);

  useEffect(() => {
    if (mapContainerRef.current) {
      const mapInstance = new Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
      });
      mapRef.current = mapInstance;

      mapInstance.on("load", () => {
        if (!mapRef.current) return;

        mapRef.current.addSource("states", {
          type: "geojson",
          data: USA_DATA,
        });

        mapRef.current.addSource("state-zip-boundary", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        mapRef.current.addLayer({
          id: "state-zip-fill",
          type: "fill",
          source: "state-zip-boundary",
          paint: {
            "fill-color": ["get", "fillColor"], 
            "fill-opacity": 0.5,
          },
        });

        mapRef.current.addLayer({
          id: "state-boundary",
          type: "line",
          source: "states",
          paint: {
            "line-color": "#fff",
          },
        });

        mapRef.current.addLayer({
          id: "state-zip-boundary",
          type: "line",
          source: "state-zip-boundary",
          paint: {
            "line-color": "#000",
            "line-width": 2,
          },
        });

        highlightBoundary();
      });
    }

    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    highlightBoundary();
  }, [zipCodes]);



  const updateLocationInfo = async () => {
    if (!mapRef.current) return

    const center = mapRef.current.getCenter()
    const zoom = mapRef.current.getZoom()

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?access_token=${TOKEN}`
      )
      const data = await response.json()

      const newLocationInfo: LocationInfo = {}

      data.features.forEach((feature: any) => {
        if (feature.place_type.includes('country')) {
          newLocationInfo.country = feature.text
        }
        if (zoom > 5 && feature.place_type.includes('region')) {
          newLocationInfo.state = feature.text
        }
        if (zoom > 10 && feature.place_type.includes('postcode')) {
          newLocationInfo.postcode = feature.text
        }
      })

      setLocationInfo(newLocationInfo)
      console.log('Current location:', newLocationInfo)
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
  }
function getColorFromPopulationDensity(density) {
  if (density < 0) {
      throw new Error("Density cannot be negative.");
  }

  // Define density ranges and corresponding colors
  const ranges = [
      { max: 50, color: "#00FF00" },   // Green: Very low density
      { max: 200, color: "#7FFF00" },  // Lime Green: Low density
      { max: 500, color: "#FFFF00" },  // Yellow: Moderate density
      { max: 1000, color: "#FFA500" }, // Orange: High density
      { max: 2000, color: "#FF4500" }, // Orange-Red: Very high density
  ];

  const defaultColor = "#FF0000"; // Red: Extreme density (above all ranges)

  // Find the appropriate range and return its color
  for (const range of ranges) {
      if (density <= range.max) {
          return range.color;
      }
  }

  return defaultColor; // Return default color for densities exceeding all ranges
}


  const highlightBoundary = () => {
    if (mapRef.current && zipCodes && zipCodes.length > 0) {
      const source = mapRef.current.getSource("state-zip-boundary") as GeoJSONSource;
      console.log(source)
      if (source) {

        source.setData({
          
          type: "FeatureCollection",
          features: zipCodes.map((zip,index) => ({
            type: "Feature",
            
            geometry: {
              type: "Polygon",
              coordinates: zip.coordinates,
              
            },
            properties: {...zip.properties,

              fillColor: getColorFromPopulationDensity(zipData[index]?parseFloat(zipData[index].density):50), // Assuming density is the property
            },
       
          })),
        });

        // Calculate the bounding box of all zip codes
        const bounds = new mapboxgl.LngLatBounds();
        zipCodes.forEach((zip) => {
          zip.coordinates[0].forEach((coord) => {
            bounds.extend(coord as [number, number]);
          });
        });

        mapRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }
    }
  };

  const setCenter = (coordinates) => {
    if (mapRef.current && zipCodes && zipCodes.length > 0) {
      mapRef.current.flyTo({center:[coordinates[1],coordinates[0]],zoom:13});
    }
  };

  const handleSearch = async (searchTerm: string,tags:string[]) => {
    try {
   //   const dataToSearch = searchTerm.split(",");
      for (const item of tags) {
        const element = zipCodes.find((element) => element.properties.ZCTA5CE10 === item);
        if (!element) {
          const res = await getZipCodeCoordinates(item);
        

          const zipData = await getZipCodeData(item);
          dispatch(setZipCodes({ zipcodes: res }));
          dispatch(setZipData({ zipData }));
        }
      }
    } catch (error) {
      console.error("Error fetching zip code data:", error);
    }
  };

  return (
    <div className="p-4">
      <SearchInput handleSearch={handleSearch} />
      <div className="flex">
        <div className="h-[100vh] w-[50vw]" ref={mapContainerRef}></div>
        <div className="h-[100vh] w-[50vw]">
          <ZipData setCenter = {setCenter}/>
        </div>
      </div>
    </div>
  );
};

export default USMAP;