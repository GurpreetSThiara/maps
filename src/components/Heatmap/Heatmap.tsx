import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { HEATMAP, TOKEN } from '../../lib/constants';

const MapWithHeatmap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = TOKEN // Replace with your Mapbox token

    // Create the Mapbox map instance
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-91.960457, 42.787320], // Center the map based on coordinates
      zoom: 13,
    });

    // Heatmap data
    const data = HEATMAP
    // Process the data for the heatmap layer
    const heatmapData = data.flatMap((property) => 
      property.coordinates.map((coord) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
        intensity: property.intensity, // Using the intensity of the property for the heatmap
      }))
    );

    // Add the heatmap layer to the map
    map.on('load', () => {
      map.addLayer({
        id: 'heatmap',
        type: 'heatmap',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: heatmapData.map((dataPoint) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [dataPoint.longitude, dataPoint.latitude],
              },
              properties: {
                intensity: dataPoint.intensity,
              },
            })),
          },
        },
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, 0,
            100, 1,
          ],
          'heatmap-intensity': 1,
          'heatmap-radius': 15,
          'heatmap-opacity': 0.6,
        },
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />;
};

export default MapWithHeatmap;
