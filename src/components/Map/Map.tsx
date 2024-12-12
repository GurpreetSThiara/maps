import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TOKEN } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { setMapBounds, setMapLevel, setMapZoomLevel, setProvince } from "@/redux/reducers/MapDataSlice";
import { getAllUSZipCodes } from "@/redux/api/firebaseDb";

const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const data = useSelector((state: any) => state.mapData.data);
  const province = useSelector((state: any) => state.mapData.province);

  const prevBoundsRef = useRef<mapboxgl.LngLatBounds | null>(null);
  const prevZoomRef = useRef<number | null>(null);

  // Initialize the map only once
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
      zoom: 4,
    });

    mapRef.current = mapInstance;

    const updateMapState = () => {
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

      updateLocationInfo()
    };

    // Map setup after loading
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
        "border"
      );

      updateMapState(); // Update map state initially
    });

    // Bind update map state to zoom and move
    mapInstance.on("moveend", updateMapState);
    mapInstance.on("zoomend", updateMapState);

    // Cleanup on unmount
    return () => {
      mapInstance.off("moveend", updateMapState);
      mapInstance.off("zoomend", updateMapState);
      mapInstance.remove();
      mapRef.current = null;
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Update map data when `data` changes
  useEffect(() => {
    if (mapRef.current && data) {
      const map = mapRef.current;
      const source = map.getSource("states") as mapboxgl.GeoJSONSource;

      if (source) {
        source.setData(data);
      } else {
        console.error("GeoJSON source 'states' not found");
      }
    }
  }, [data]); // Run only when `data` changes

  // Update location info based on map center and zoom
  const updateLocationInfo = async () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?access_token=${TOKEN}`
      );

      const locationData = await response.json();

      const newLocationInfo: any = {};
      locationData.features.forEach((feature: any) => {
        if (feature.place_type.includes('country')) {
          newLocationInfo.country = feature.text;
        }
        if (zoom > 7 && feature.place_type.includes('region')) {
          newLocationInfo.state = feature.text;
          if (province !== feature.text) {
            dispatch(setProvince(feature.text));
            getAllUSZipCodes(feature.text, dispatch);
          }
        }
        if (zoom > 10 && feature.place_type.includes('postcode')) {
          newLocationInfo.postcode = feature.text;
        }
      });

      console.log('Current location:', newLocationInfo);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  return (
    <div className="w-full h-full" ref={mapContainerRef} aria-label="Interactive Map"></div>
  );
};

export default Map;
