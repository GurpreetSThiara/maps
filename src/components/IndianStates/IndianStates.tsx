import React, { memo, useEffect, useRef } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

mapboxgl.accessToken = 'your_mapbox_access_token'; // Replace with your Mapbox access token

// Example GeoJSON data for Indian states (add more states as needed)
const indiaStatesGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Uttar Pradesh", "population": "199812341" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [77.837451, 35.49401],
              [78.912268, 34.321936],
              [79.208892, 32.994394],
              [79.555659, 32.327963],
              [79.793004, 31.869112],
              [79.330544, 31.610747],
              [78.420443, 31.588235],
              [77.837451, 35.49401]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Maharashtra", "population": "112374333" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [72.870727, 19.214841],
              [73.855327, 18.910953],
              [74.166292, 18.676945],
              [74.229287, 18.452597],
              [73.859352, 18.257135],
              [73.085039, 18.213351],
              [72.870727, 19.214841]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Bihar", "population": "104099452" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [84.956445, 26.594825],
              [85.989335, 26.454728],
              [86.247374, 25.992806],
              [86.760993, 25.668357],
              [86.436551, 25.289651],
              [84.956445, 26.594825]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Karnataka", "population": "61095297" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [74.567928, 14.874185],
              [75.362398, 14.228263],
              [76.047934, 13.105097],
              [77.227604, 12.181191],
              [77.709739, 12.097185],
              [77.834896, 13.063566],
              [76.555031, 14.726695],
              [74.567928, 14.874185]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "West Bengal", "population": "91276115" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [88.051922, 27.023819],
              [89.132666, 26.843477],
              [89.655359, 25.829321],
              [89.638537, 24.799728],
              [88.394518, 24.674102],
              [88.051922, 27.023819]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Andhra Pradesh", "population": "49577103" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [79.653426, 19.351540],
              [80.758271, 17.442421],
              [81.790125, 17.181157],
              [82.286749, 16.602748],
              [82.223027, 14.999136],
              [80.752466, 14.654986],
              [79.653426, 19.351540]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Gujarat", "population": "60383928" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [68.057334, 23.697815],
              [69.778704, 22.965287],
              [71.121236, 21.442849],
              [71.485646, 20.829533],
              [71.586228, 20.067905],
              [71.229606, 19.783184],
              [69.429672, 19.104217],
              [68.057334, 23.697815]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Haryana", "population": "25351462" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [76.394696, 30.421528],
              [77.105206, 29.782004],
              [77.771536, 29.337878],
              [77.919462, 29.024569],
              [77.214844, 28.421159],
              [76.394696, 30.421528]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Punjab", "population": "27704236" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [74.458828, 31.477709],
              [75.570432, 30.807392],
              [76.051822, 30.766772],
              [76.849091, 30.417575],
              [76.836823, 30.129634],
              [75.714238, 29.715419],
              [74.458828, 31.477709]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Kerala", "population": "33103402" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [74.774598, 11.091951],
              [75.278075, 10.505043],
              [75.825385, 9.985901],
              [76.599481, 9.540068],
              [76.943379, 8.945061],
              [77.071811, 8.308631],
              [76.764349, 8.027987],
              [76.320242, 8.018211],
              [75.972664, 8.040661],
              [75.589913, 8.083908],
              [74.774598, 11.091951]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Tamil Nadu", "population": "72147030" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [78.567319, 11.016823],
              [78.560027, 9.982797],
              [78.694938, 9.492609],
              [79.153478, 9.319388],
              [79.287907, 9.661818],
              [79.567944, 10.173882],
              [78.567319, 11.016823]
            ]
          ]
        }
      }
    ]
  }
  

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref to the map container
  const mapRef = useRef<Map | null>(null); // Ref to the Mapbox map instance

  useEffect(() => {
    if (mapContainerRef.current) {
      // Initialize the map
    //   mapboxgl.accessToken =
    //   "pk.eyJ1IjoibG92ZXJvc2UxMjM0NSIsImEiOiJjbTNzb2dxZDIwMGpvMmtzY3dmdWN1bTZwIn0.yV8rSqXjiW2Tqzo6Rk01kw";
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [79.0193, 21.1458], // Center on India
        zoom: 4
      });

      // Add the GeoJSON layer for Indian states
      mapRef.current.on('load', () => {
        mapRef.current?.addSource('states', {
          type: 'geojson',
          data: indiaStatesGeoJSON
        });

        mapRef.current?.addLayer({
          id: 'state-polygons',
          type: 'fill',
          source: 'states',
          paint: {
            'fill-color': '#0080ff', // Color of the state polygons
            'fill-opacity': 0.6
          }
        });

        // Add click event to show state information
        mapRef.current?.on('click', 'state-polygons', (e) => {
          const feature = e.features && e.features[0];
          if (feature) {
            const stateName = feature.properties?.name;
            const population = feature.properties?.population;
            alert(`State: ${stateName}\nPopulation: ${population}`);
          }
        });
      });

      // Cleanup function to remove the map when the component unmounts
      return () => {
        mapRef.current?.remove();
      };
    }
  }, []);

  return (
    <div>
        <input type="text" placeholder="Search for a state"/>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default memo(MapComponent);
