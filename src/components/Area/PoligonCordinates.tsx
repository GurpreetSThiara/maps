import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const paragraphStyle = {
  fontFamily: 'Open Sans',
  margin: 0,
  fontSize: 13
};

const MapboxExample = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [locationInfo, setLocationInfo] = useState(null); // New state to hold location info

  console.log(polygonCoordinates);
  console.log(locationInfo); // Log the location info

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicGFwYWtpcGFyaSIsImEiOiJjbTN3cDd5cWMxZGRjMmxzZmZ6Nmh1bzl6In0.APXachcFlnNYTKjENUSFYw";

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [75.90, 31.63],
      zoom: 12
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });

    mapRef.current.addControl(draw);

    // Add event listeners for draw actions
    mapRef.current.on('draw.create', updateCoordinates);
    mapRef.current.on('draw.delete', updateCoordinates);
    mapRef.current.on('draw.update', updateCoordinates);

    function updateCoordinates(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const polygon = data.features[0];
        const coordinates = polygon.geometry.coordinates[0]; // Outer ring of the polygon

        // Transform coordinates into array of objects
        const formattedCoordinates = coordinates.map(([longitude, latitude]) => ({
          latitude,
          longitude
        }));

        // Set polygon coordinates
        setPolygonCoordinates(formattedCoordinates);

        // Fetch location info from Mapbox API
        const center = polygon.geometry.coordinates[0][0]; // Taking the first coordinate for center
        getLocationInfo(center[0], center[1], formattedCoordinates); // Fetch location info for the center
      } else {
        setPolygonCoordinates([]);
        if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
      }
    }

    // Function to fetch location information from Mapbox API based on coordinates
    async function getLocationInfo(longitude, latitude,formattedCoordinates) {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      
      const place = data.features[0]; // Taking the first result

      // Extract relevant information
      const extractedData = {
        postalCode: place.text,
        placeName: place.place_name,
        boundingBox: place.bbox,
        coordinates:formattedCoordinates,
        center: place.center,
        locationContext: {
          locality: place.context.find(c => c.id.includes('locality'))?.text || 'N/A',
          place: place.context.find(c => c.id.includes('place'))?.text || 'N/A',
          district: place.context.find(c => c.id.includes('district'))?.text || 'N/A',
          region: place.context.find(c => c.id.includes('region'))?.text || 'N/A',
          country: place.context.find(c => c.id.includes('country'))?.text || 'N/A',
        }
      };

      // Update the location info state with the extracted data
      setLocationInfo(extractedData);
      
    }
  }, []);

  return (
    <>
      <div className="h-[50rem] w-[100rem]" ref={mapContainerRef} id="map"></div>
      <div
        className="calculation-box"
        style={{
          height: 150,
          width: 300,
          position: 'absolute',
          bottom: 40,
          left: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 15,
          textAlign: 'center',
          overflowY: 'auto'
        }}
      >
        <p style={paragraphStyle}>Click the map to draw a polygon.</p>
        <div id="polygon-coordinates">
          {polygonCoordinates.length > 0 ? (
            <>
              <p style={paragraphStyle}>
                <strong>Coordinates:</strong>
              </p>
              <ul style={{ textAlign: 'left', fontSize: 12, padding: 0 }}>
                {polygonCoordinates.map((coord, index) => (
                  <li key={index}>
                    Latitude: {coord.latitude.toFixed(6)}, Longitude: {coord.longitude.toFixed(6)}
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
            <ul style={{ textAlign: 'left', fontSize: 12, padding: 0 }}>
              <li>Postal Code: {locationInfo.postalCode}</li>
              <li>Place Name: {locationInfo.placeName}</li>
              {/* <li>Coordinates: {locationInfo.coordinates[1].toFixed(6)}, {locationInfo.coordinates[0].toFixed(6)}</li> */}
              <li>Bounding Box: {locationInfo.boundingBox?.join(', ')}</li>
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

export default MapboxExample;
