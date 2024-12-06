/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TOKEN } from "@/lib/constants";
import { ELECTION_RESULTS, USA_DATA } from "@/lib/usData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ColorCodes from "./ColorCodes";
import ElectionResults from "./Result";
const UsaMap = () => {
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState("trump");
  const [mergedData, setMergedData] = useState<any>();
  

  function mergeGeoJsonWithElectionData(geoJson:any, electionData:any) {
    console.log("map rendered");
    const mergedFeatures = geoJson.features.map((feature:any) => {
      const stateName = feature.properties?.name;
      const stateData = electionData.find((data:any) => data.state === stateName);

      if (stateData) {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            ...stateData,
          },
        };
      }

      return feature;
    });

    return {
      ...geoJson,
      features: mergedFeatures,
    };
  }

  const getColorForRange = (value : number, isTrump:boolean) => {
    if (value < 45) {
      return isTrump ? "#f1959b" : "#a8d5ba";
    } else if (value >= 45 && value < 50) {
      return isTrump ? "#f1959b" : "#8ecba0";
    } else if (value >= 50 && value < 55) {
      return isTrump ? "#ec6d76" : "#76bf86";
    } else if (value >= 55 && value < 60) {
      return isTrump ? "#e74c3c" : "#63a96f";
    } else if (value >= 60) {
      return isTrump ? "#c0392b" : "#4e8a58";
    }
    return "#fff";
  };
  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-122.66596280620654, 46.244052908166054],
      zoom: 2,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      const mergedData = mergeGeoJsonWithElectionData(
        USA_DATA,
        ELECTION_RESULTS
      );
      //console.log(mergedData)
      setMergedData(mergedData);

      map.current.addSource("states", {
        type: "geojson",
        data: mergedData,
      });

      map.current.addLayer(
        {
          id: "states",
          type: "fill",
          source: "states",
          paint: {
       
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", `${value}`],
              40,
              `${value === "trump" ? "#f1959b" : "#a8d5ba"}`,
              45,
              `${value === "trump" ? "#f1959b" : "#8ecba0"}`,

              50,
              `${value === "trump" ? "#ec6d76" : "#76bf86"}`,

              55,
              `${value === "trump" ? "#e74c3c" : "#63a96f"}`,

              60,
              `${value === "trump" ? "#c0392b" : "#4e8a58"}`,
            ],
            "line-border-color":"#000"
          },
        },
        "state-label"
      );
      map.current.setPaintProperty("state-label", "text-color", "#000");
   
      map.current.addLayer({
        id: "state-boundary",
        type: "line",
        source: "states",
        paint: {
          "line-color": "#fff",
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
      });

      map.current.on("mouseenter", "states", (e) => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "pointer";

          //   console.log(e)
          //   console.log("first")

          const html = `<div class="p-2 rounded-md">
          <div class="text-black">State/Province: ${
            e.features![0].properties?.state
          }</div>
          <div class="text-black">Trump: ${
            e.features![0].properties?.trump
          }%</div>
           <div class="text-black">harris: ${
             e.features![0].properties?.harris
           }%</div>

                <div class="text-black">Electoral Votes: ${
                  e.features![0].properties?.electoralVotes
                }</div>
                  <div class="text-black">Reported Votes: ${
                    e.features![0].properties?.reported
                  }%</div>

          </div>`;
          popup.setLngLat(e.lngLat).setHTML(html).addTo(map.current);
        }
      });

      map.current.on("mouseleave", "places", () => {
      if(map.current){
        map.current.getCanvas().style.cursor = "";
        popup.remove();
      }
      });
    });
  }, []);

  const updateLayer = (value: string) => {
    if (map.current) {
      map.current.setPaintProperty("states", "fill-color", [
        "interpolate",
        ["linear"],
        ["get", `${value}`],
        40,
        `${value === "trump" ? "#f1959b" : "#a8d5ba"}`,
        45,
        `${value === "trump" ? "#f1959b" : "#8ecba0"}`,

        50,
        `${value === "trump" ? "#ec6d76" : "#76bf86"}`,

        55,
        `${value === "trump" ? "#e74c3c" : "#63a96f"}`,

        60,
        `${value === "trump" ? "#c0392b" : "#4e8a58"}`,
      ]);
    }
  };

  const handleMapFly = (center:any) => {
    if (map.current) {
      map.current.flyTo({
        center: center,
        zoom: 5,
      });
    }
  };

  return (
    <div>
      <div className="bg-gray-100">
        <nav className="flex items-center justify-center ">
          <div className="flex w-[80%] items-center justify-between py-4">
            <h1 className="text-4xl font-extrabold">HeatMAPs</h1>
            <div className="">
              <Select
                value={value}
                onValueChange={(value) => {
                  setValue(value);

                  updateLayer(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trump">Trump</SelectItem>
                  <SelectItem value="harris">harris</SelectItem>
                  {/* <SelectItem value="other">Other</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </nav>
      </div>
      <div className="h-4"></div>
   
      <div className="w=[100vw] flex  items-start justify-center  rounded-2xl gap-4">
    <div className="flex flex-col gap-4">
    <div className="px-4">
    <ColorCodes/>
    </div>
    <div className="px-4">
    <ElectionResults/></div>
    </div>
        {" "}
        <div
          className="h-[90vh] w-[50vw] rounded-2xl "
          ref={mapContainerRef}
        ></div>
        <div className="w-[20vw] h-[90vh] overflow-auto p-4 bg-gray-50 flex flex-col gap-2 rounded-lg">
          {mergedData &&
            mergedData.features &&
            mergedData.features.map((result:any) => {
              return (
                <div
                role="button"
                className="flex flex-col items-center justify-center w-full transition-transform transform rounded-lg shadow-md cursor-pointer hover:scale-105 hover:shadow-lg"
                key={result.properties.state}
                onClick={() =>
                  handleMapFly(result.geometry.coordinates[0][0])
                }
              >
                <div
                  style={{
                    backgroundColor: `${getColorForRange(
                      result.properties.trump > result.properties.harris
                        ? result.properties.trump
                        : result.properties.harris,
                      result.properties.trump > result.properties.harris
                        ? true
                        : false
                    )}`,
                  }}
                  className="flex flex-col items-center justify-center w-full p-3 font-semibold text-white rounded-lg shadow-inner"
                >
                  <p className="text-lg">State: {result.properties.state}</p>
                  <div className="mt-2 text-sm">
                    <p>Trump: {result.properties.trump}</p>
                    <p>Harris: {result.properties.harris}</p>
                  </div>
                </div>
              </div>
              
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default UsaMap;
