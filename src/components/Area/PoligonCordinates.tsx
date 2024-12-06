import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { TOKEN } from "@/lib/constants";
import { Feature, GeoJsonProperties, Geometry, Polygon } from "geojson";

const paragraphStyle = {
  fontFamily: "Open Sans",
  margin: 0,
  fontSize: 13,
};

interface LocationInfo {
  postalCode: string;
  placeName: string;
  boundingBox: number[];
  coordinates: { latitude: number; longitude: number }[];
  center: number[];
  locationContext: {
    locality: string;
    place: string;
    district: string;
    region: string;
    country: string;
  };
}

const CalcMapCoordinates = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<Map | null>(null);
  const [polygonCoordinates, setPolygonCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  
  const [poligons, setPoligons] = useState<
    (Polygon | Feature<Geometry, GeoJsonProperties>)[]
  >([]);

  console.log(polygonCoordinates);
  console.log(locationInfo);

  useEffect(() => {
    mapboxgl.accessToken = TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style:"mapbox://styles/mapbox/streets-v9",// "mapbox://styles/mapbox/satellite-streets-v11",
      center: [75.9, 31.63],
      zoom: 12,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    mapRef.current.addControl(draw);

    mapRef.current.on("draw.create", updateCoordinates);
    mapRef.current.on("draw.delete", updateCoordinates);
    mapRef.current.on("draw.update", updateCoordinates);

    function updateCoordinates(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        console.log(data)
        const polygon = data.features[0];

        console.log(polygon);

        setPoligons((prev) => [...prev, polygon]);
        const coordinates = (polygon.geometry as Polygon).coordinates[0];

        const formattedCoordinates = coordinates.map(
          ([longitude, latitude]) => ({
            latitude,
            longitude,
          })
        );

        setPolygonCoordinates(formattedCoordinates);
        const center = (polygon.geometry as Polygon).coordinates[0][0];
        getLocationInfo(center[0], center[1], formattedCoordinates);
      } else {
        setPolygonCoordinates([]);
        if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
      }
    }

    // Function to fetch location information from Mapbox API based on coordinates
    async function getLocationInfo(
      longitude: number,
      latitude: number,
      formattedCoordinates: { latitude: number; longitude: number }[]
    ) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      const place = data.features[0];

      const extractedData = {
        postalCode: place.text,
        placeName: place.place_name,
        boundingBox: place.bbox,
        coordinates: formattedCoordinates,
        center: place.center,
        locationContext: {
          locality:
            place.context.find((c: { id: string }) => c.id.includes("locality"))
              ?.text || "N/A",
          place:
            place.context.find((c: { id: string }) => c.id.includes("place"))
              ?.text || "N/A",
          district:
            place.context.find((c: { id: string }) => c.id.includes("district"))
              ?.text || "N/A",
          region:
            place.context.find((c: { id: string }) => c.id.includes("region"))
              ?.text || "N/A",
          country:
            place.context.find((c: { id: string }) => c.id.includes("country"))
              ?.text || "N/A",
        },
      };

      setLocationInfo(extractedData);
    }
  }, []);

  return (
    <>
      <div
        className="h-[50rem] w-[100rem]"
        ref={mapContainerRef}
        id="map"
      ></div>
      <div
        className="calculation-box"
        style={{
          height: 150,
          width: 300,
          position: "absolute",
          bottom: 40,
          left: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: 15,
          textAlign: "center",
          overflowY: "auto",
        }}
      >
        <p style={paragraphStyle}>Click the map to draw a polygon.</p>
        <div id="polygon-coordinates">
          {polygonCoordinates.length > 0 ? (
            <>
              <p style={paragraphStyle}>
                <strong>Coordinates:</strong>
              </p>
              <ul style={{ textAlign: "left", fontSize: 12, padding: 0 }}>
                {polygonCoordinates.map((coord, index) => (
                  <li key={index}>
                    Latitude: {coord.latitude.toFixed(6)}, Longitude:{" "}
                    {coord.longitude.toFixed(6)}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p style={paragraphStyle}>No polygon selected.</p>
          )}
        </div>

        {locationInfo && (
          <div id="location-info">
            <p style={paragraphStyle}>
              <strong>Location Info:</strong>
            </p>
            <ul style={{ textAlign: "left", fontSize: 12, padding: 0 }}>
              <li>Postal Code: {locationInfo.postalCode}</li>
              <li>Place Name: {locationInfo.placeName}</li>
              {/* <li>Coordinates: {locationInfo.coordinates[1].toFixed(6)}, {locationInfo.coordinates[0].toFixed(6)}</li> */}
              <li>Bounding Box: {locationInfo.boundingBox?.join(", ")}</li>
              <li>Locality: {locationInfo.locationContext.locality}</li>
              <li>Place: {locationInfo.locationContext.place}</li>
              <li>District: {locationInfo.locationContext.district}</li>
              <li>Region: {locationInfo.locationContext.region}</li>
              <li>Country: {locationInfo.locationContext.country}</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CalcMapCoordinates;
