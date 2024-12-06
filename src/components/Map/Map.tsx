/* eslint-disable @typescript-eslint/no-explicit-any */ // Narrow scope of disabling where required
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TOKEN } from "@/lib/constants";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useDispatch, useSelector } from "react-redux";
import {

  setMapBounds,
  setMapLevel,
  setMapZoomLevel,
  setProvince,
} from "@/redux/reducers/MapDataSlice";
import { getAllUSZipCodes } from "@/redux/api/firebaseDb";

const Map = () => {
  console.log("Map loaded")
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const data = useSelector((state:any)=>state.mapData.data)

  const prevBoundsRef = useRef<mapboxgl.LngLatBounds | null>(null);
  const prevZoomRef = useRef<number | null>(null);
const prtovince = useSelector((state:any)=>state.mapData.province)
  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error("Map container ref is null");
      return;
    }

    mapboxgl.accessToken = TOKEN;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 9,
    });

    mapRef.current = mapInstance;

    const updateMapState = () => {
      updateLocationInfo();
      if (!mapRef.current) return;
    
      const bounds = mapRef.current.getBounds();
      const zoom = mapRef.current.getZoom();
    
      const currentBounds = bounds!.toArray();
      const prevBounds = prevBoundsRef.current?.toArray();
    
      const isSameBounds =
        prevBounds &&
        currentBounds[0][0] === prevBounds[0][0] &&
        currentBounds[0][1] === prevBounds[0][1] &&
        currentBounds[1][0] === prevBounds[1][0] &&
        currentBounds[1][1] === prevBounds[1][1];
    
      if (isSameBounds && prevZoomRef.current === zoom) {
        return;
      }
    
      prevBoundsRef.current = bounds;
      prevZoomRef.current = zoom;
    
      dispatch(setMapBounds({ bounds: currentBounds }));
      dispatch(setMapZoomLevel({ zoomLevel: zoom }));
    
      if (zoom <= 5) {
        dispatch(setMapLevel("province"));
      } else if (zoom <= 10) {
        dispatch(setMapLevel("city"));
      } else {
        dispatch(setMapLevel("zip"));
      }
    };
    

    mapInstance.on("load", () => {
      mapInstance.addSource("states", {
        type: "geojson",
        data: data,
      });

      mapInstance.addLayer({
        id: "border",
        type: "line",
        source: "states",
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });

      mapInstance.addLayer(
        {
          id: "state",
          type: "fill",
          source: "states",
          paint: {
            "fill-color": "#002244",
            "fill-opacity": 1,
          },
        },
        "border" // Add after the "border" layer
      );

      updateMapState();
    });

    mapInstance.on("moveend", updateMapState);
    mapInstance.on("zoomend", updateMapState);

    // Cleanup on unmount
    return () => {
      mapInstance.off("moveend", updateMapState);
      mapInstance.off("zoomend", updateMapState);
      mapInstance.remove();
      mapRef.current = null;
    };
  }, [data, dispatch]);


  const updateLocationInfo = async () => {
    const map =mapRef
    if (!map.current) return

    const center = map.current.getCenter()
    const zoom = map.current.getZoom()

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?access_token=${TOKEN}`
      )

      
      const data = await response.json()

      const newLocationInfo = {}


      console.log(data)

      data.features.forEach((feature: any) => {
        if (feature.place_type.includes('country')) {
          newLocationInfo.country = feature.text
        }
        if (zoom > 7 && feature.place_type.includes('region')) {
          newLocationInfo.state = feature.text
          if(prtovince !== feature.text)
            dispatch(setProvince(feature.text))
            getAllUSZipCodes(feature.text ,dispatch)
        }
        if (zoom > 10 && feature.place_type.includes('postcode')) {
          newLocationInfo.postcode = feature.text
        }
      })

     // setLocationInfo(newLocationInfo)
      console.log('Current location:', newLocationInfo)
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
  }

  return (
    <div
      className="w-full h-full"
      ref={mapContainerRef}
      aria-label="Interactive Map"
    ></div>
  );
};

export default Map;
