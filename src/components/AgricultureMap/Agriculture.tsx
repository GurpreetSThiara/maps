"use client"

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { PROPERTY_DATA } from '../../lib/data'
import { TOKEN } from '../../lib/constants'

mapboxgl.accessToken = TOKEN

const Agriculture: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [visibleProperties, setVisibleProperties] = useState<any[]>([])

  useEffect(() => {
    if (mapContainerRef.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [75.841481, 31.635354], // Center on Hoshiarpur, Punjab
        zoom: 10,
      })

      map.current.on('load', () => {
        if (map.current) {
          map.current.addSource('properties', {
            type: 'geojson',
            data: PROPERTY_DATA,
          })

          map.current.addLayer({
            id: 'property-layer',
            type: 'fill',
            source: 'properties',
            paint: {
              'fill-color': [
                'match',
                ['get', 'soilType'],
                'Alluvial', '#FFA07A',
                'Loamy', '#98FB98',
                'Sandy loam', '#DEB887',
                'Clay loam', '#D2691E',
                'Silt loam', '#F0E68C',
                'Rich loam', '#8FBC8F',
                '#BBBBBB' // default color
              ],
              'fill-opacity': 0.7,
            },
          })

          map.current.addLayer({
            id: 'property-outline',
            type: 'line',
            source: 'properties',
            paint: {
              'line-color': '#000',
              'line-width': 2,
            },
          })

          // Add marker layer for zoomed out view
          map.current.addLayer({
            id: 'property-marker',
            type: 'circle',
            source: 'properties',
            paint: {
              'circle-radius': 6,
              'circle-color': '#002244',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#002244',
            },
          
          })

          // Show/hide layers based on zoom level
          map.current.on('zoom', () => {
            if (map.current) {
              const zoom = map.current.getZoom()
              map.current.setLayoutProperty('property-layer', 'visibility', zoom > 16 ? 'visible' : 'none')
              map.current.setLayoutProperty('property-outline', 'visibility', zoom > 16 ? 'visible' : 'none')
             map.current.setLayoutProperty('property-marker', 'visibility', zoom <= 16 ? 'visible' : 'none')
            }
          })

          // Add popups
          map.current.on('click', 'property-layer', (e) => {
            if (e.features && e.features[0].properties) {
              const coordinates = e.lngLat
              const properties = e.features[0].properties
              setSelectedProperty(properties)

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`
                  <div class="p-4 max-w-sm">
                    <h3 class="text-lg font-bold mb-2">${properties.placeName}</h3>
                    <p class="mb-2">${properties.description}</p>
                    <p class="mb-1"><strong>Owner:</strong> ${properties.ownerName}</p>
                    <p class="mb-1"><strong>Price:</strong> ₹${properties.price.toLocaleString()}</p>
                    <p class="mb-1"><strong>Area:</strong> ${properties.area} acres</p>
                    <p class="mb-1"><strong>Soil Type:</strong> ${properties.soilType}</p>
                    
                    <p class="mb-1"><strong>Organic:</strong> ${properties.organicCertified ? 'Yes' : 'No'}</p>
                  </div>
                `)
                .addTo(map.current)
            }
          })
{/* <p class="mb-1"><strong>Crops:</strong> ${properties.crops.join(', ')}</p> */}
          // Change cursor on hover
          map.current.on('mouseenter', 'property-layer', () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer'
          })
          map.current.on('mouseleave', 'property-layer', () => {
            if (map.current) map.current.getCanvas().style.cursor = ''
          })

          // Update visible properties on map move
          map.current.on('moveend', updateVisibleProperties)
        }
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const updateVisibleProperties = () => {
    if (map.current) {
      const bounds = map.current.getBounds()
      console.log(bounds)
      const visibleFeatures = map.current.queryRenderedFeatures({
        layers: ['property-layer', 'property-marker']
      })

      const uniqueFeatures = visibleFeatures.filter((feature, index, self) =>
        index === self.findIndex((t) => t.properties.placeName === feature.properties.placeName)
      )

      setVisibleProperties(uniqueFeatures.map(feature => feature.properties))
    }
  }

  const handleSearch = () => {
    const filteredFeatures = PROPERTY_DATA.features.filter((feature) =>
      feature.properties.placeName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (map.current) {
      map.current.getSource('properties').setData({
        type: 'FeatureCollection',
        features: filteredFeatures,
      })

      if (filteredFeatures.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        filteredFeatures.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates[0])
        })
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 })
      }
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white shadow-md">
        <div className="flex">
          <input
            type="text"
            placeholder="Search properties"
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex flex-grow">
        <div className="w-1/2 h-full" ref={mapContainerRef}></div>
        <div className="w-1/2 h-full p-4 overflow-y-auto bg-gray-100">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleProperties.map((property, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden ${selectedProperty === property ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">{property.placeName}</h3>
                  <p className="mb-2 text-sm text-gray-600">{property.description}</p>
                  <p className="mb-1 text-sm"><span className="font-medium">Owner:</span> {property.ownerName}</p>
                  <p className="mb-1 text-sm"><span className="font-medium">Price:</span> ₹{property.price.toLocaleString()}</p>
                  <p className="mb-1 text-sm"><span className="font-medium">Area:</span> {property.area} acres</p>
                  <p className="mb-1 text-sm"><span className="font-medium">Soil Type:</span> {property.soilType}</p>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Crops:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {/* {property.crops.map((crop, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-gray-200 rounded-full">{crop}</span>
                      ))} */}
                    </div>
                  </div>
                  <p className="mb-1 text-sm">
                    <span className="font-medium">Organic:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${property.organicCertified ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                      {property.organicCertified ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>Map
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agriculture

