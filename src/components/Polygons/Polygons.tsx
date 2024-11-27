import React, { useEffect, useRef } from 'react'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Polygons = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);


  useEffect(()=>{
    mapboxgl.accessToken =
    "pk.eyJ1IjoibG92ZXJvc2UxMjM0NSIsImEiOiJjbTNzb2dxZDIwMGpvMmtzY3dmdWN1bTZwIn0.yV8rSqXjiW2Tqzo6Rk01kw";

    const mapInstance = new mapboxgl.Map({
        container:mapContainerRef.current!,
        center: [-74.0242, 40.6941],
        style: "mapbox://styles/mapbox/streets-v11",
        
        zoom: 10.12,
  })

  mapRef.current = mapInstance;


  mapInstance.on('load', () => {
    // Add a data source containing GeoJSON data.
    mapInstance.addSource('punjab', {
      'type': 'geojson',
      'data': {
          'type': 'Feature',
          'geometry': {
              'type': 'Polygon',
              // Expanded coordinates outlining Punjab, India with 30 additional points.
              'coordinates': [
                  [
                      [74.0437, 30.9285],
                      [74.169, 30.971],
                      [74.2978, 30.9812],
                      [74.4856, 30.8415],
                      [74.4914, 30.6718],
                      [74.5717, 30.6112],
                      [74.5899, 30.4888],
                      [74.6679, 30.4431],
                      [74.7399, 30.4537],
                      [74.8432, 30.4051],
                      [74.8725, 30.3066],
                      [74.8718, 30.1615],
                      [74.7367, 30.0335],
                      [74.5272, 30.0506],
                      [74.4327, 30.1137],
                      [74.3023, 30.2049],
                      [74.231, 30.3056],
                      [74.1871, 30.4073],
                      [74.0875, 30.4642],
                      [74.0343, 30.5454],
                      [73.9045, 30.5321],
                      [73.8463, 30.6134],
                      [73.7886, 30.7327],
                      [73.6251, 30.7911],
                      [73.5706, 30.7918],
                      [73.5015, 30.6602],
                      [73.4608, 30.6045],
                      [73.4151, 30.5474],
                      [73.3667, 30.4755],
                      [73.3651, 30.4177],
                      [73.5153, 30.2979],
                      [73.6129, 30.2133],
                      [73.7438, 30.1456],
                      [73.8544, 30.0721],
                      [73.9748, 30.0232],
                      [74.0415, 29.9317],
                      [74.0904, 29.8412],
                      [74.1213, 29.7691],
                      [74.1879, 29.6793],
                      [74.2623, 29.6301],
                      [74.3121, 29.5658],
                      [74.3743, 29.5172],
                      [74.4201, 29.4563],
                      [74.4915, 29.4138],
                      [74.5512, 29.3483],
                      [74.6232, 29.2987],
                      [74.6804, 29.2673],
                      [74.7432, 29.2217],
                      [74.8048, 29.1911],
                      [74.8507, 29.1184],
                      [74.8998, 29.0532],
                      [74.9436, 29.0093],
                      [74.9813, 28.9587],
                      [75.0109, 28.9194],
                      [74.9804, 28.8867],
                      [74.9435, 28.8679],
                      [74.9107, 28.8273],
                      [74.8852, 28.7898],
                      [74.8601, 28.7603],
                      [74.8432, 30.4051] // Closing the polygon
                  ]
              ]
          }
      }
  });
  

    // Add a new layer to visualize the polygon.
    mapInstance.addLayer({
        'id': 'punjab',
        'type': 'fill',
        'source': 'punjab', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
        }
    });
    // Add a black outline around the polygon.
    mapInstance.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'punjab',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 3
        }
    });
});},[])

  return (
    <div>
      <div className="h-[50rem] w-[50rem]" ref={mapContainerRef}></div>
    </div>
  )
}

export default Polygons