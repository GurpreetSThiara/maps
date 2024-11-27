import React, { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


const PolyGon = () => {
  const mapRef = useRef<mapboxgl.Map | null>();
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [countryName, setCountryName] = useState<string>('');


  useEffect(()=>{

    mapboxgl.accessToken =
    "pk.eyJ1IjoibG92ZXJvc2UxMjM0NSIsImEiOiJjbTNzb2dxZDIwMGpvMmtzY3dmdWN1bTZwIn0.yV8rSqXjiW2Tqzo6Rk01kw";

    const mapInstance = new mapboxgl.Map({
      container:containerRef.current!,
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 10.12,
    })

    mapRef.current = mapInstance;

    mapInstance.on('load',()=>{
      mapInstance.addLayer({
        id:'country-boundaries',
        source:{
          type:'vector',
          url:'mapbox://mapbox.country-boundaries-v1'
        },
        'source-layer': 'country_boundaries',
        type:'fill',
        paint: {
          'fill-color': '#002244',
          'fill-opacity': 0.6
        }
      },
    'country-label')


   // mapInstance.setFilter('country-boundaries',["in"])
    });



    return () => {
      mapInstance.remove();
    }
  },[])



  const handleHighlightCountry = () => {
    if (mapRef.current) {
      if (countryName.trim() === "") {
    
        mapRef.current.setFilter("country-boundaries", null);
      } else {
        
     
        console.log(countryName)
        console.log(countryName)
        console.log(countryName)
        mapRef.current.setFilter("country-boundaries", [
          "==",
          "name_en",
          countryName.charAt(0).toUpperCase() + countryName.slice(1),
        ]);
      }
    }
  };
  return (
    <div>
         <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 mb-2 border"
          placeholder="Enter country name (e.g., United States)"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
        />
        <button
          onClick={handleHighlightCountry}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Highlight Country
        </button>
      </div>
      MAP
      <div className="h-[50rem] w-[50rem] border " ref={containerRef}></div>
    </div>
  )
}

export default PolyGon