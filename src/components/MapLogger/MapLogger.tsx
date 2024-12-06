

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { TOKEN } from '@/lib/constants'

interface LocationInfo {
  country?: string
  state?: string
  postcode?: string
}

export default function MapboxLocationLogger() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({})

  useEffect(() => {
    if (map.current) return // Initialize map only once

  const mapInstance = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    })
map.current = mapInstance
    

    mapInstance.on('load', () => {
      const updateLocationNames = () => {
        const zoom = map.current.getZoom(); // Get the current zoom level
        let layer = '';
    
        if (zoom < 5) {
          layer = 'country'; // Display countries
        } else if (zoom < 8) {
          layer = 'region'; // Display states or provinces
        } else if (zoom < 12) {
          layer = 'place'; // Display cities
        } else {
          layer = 'postal_code'; // Display zip codes (if available in your data)
        }
    
        // Query visible features in the current viewport for the selected layer
        const features = map.current.queryRenderedFeatures({ layers: [layer] });
    
        const names = features.map((feature) => feature.properties.name).filter(Boolean);
    
        // Display names (e.g., in a sidebar or console)
        console.log('Visible Names:', names);
        // You can update your UI with `names` here.
      };
    
      // Update location names whenever the map is moved or zoomed
     if(map.current){
      map.current.on('move', updateLocationNames);
      map.current.on('zoom', updateLocationNames);
     }
    
      // Initial call to display location names
     // updateLocationNames();
    });
    

    map.current.on('moveend', updateLocationInfo)

    return () => {
      map.current?.remove()
    }
  }, [])

  const updateLocationInfo = async () => {
    if (!map.current) return

    const center = map.current.getCenter()
    const zoom = map.current.getZoom()

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?access_token=${TOKEN}`
      )

      
      const data = await response.json()

      const newLocationInfo: LocationInfo = {}


      console.log(data)

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

  return (
    <div className="flex flex-col h-screen">
      <div ref={mapContainer} className="h-3/4" />
      <div className="p-4 bg-gray-100 h-1/4">
        <h2 className="mb-2 text-xl font-bold">Current Location:</h2>
        <p>Country: {locationInfo.country || 'N/A'}</p>
        <p>State/Province: {locationInfo.state || 'N/A'}</p>
        <p>Postal Code: {locationInfo.postcode || 'N/A'}</p>
      </div>
    </div>
  )
}

