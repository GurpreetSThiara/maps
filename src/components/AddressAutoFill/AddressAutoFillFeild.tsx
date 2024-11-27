'use client'

import React, { useCallback } from 'react'
import { AddressAutofill as MapboxAddressAutofill } from '@mapbox/search-js-react'
import { TOKEN } from '../../lib/constants'




export const AddressAutofillFeild: React.FC = () => {
  
  const handleRetrieve = useCallback(
    (res) => {
      const [longitude, latitude] = res.features[0].geometry.coordinates
      const name = res.features[0].place_name
      console.log(latitude)
      console.log(longitude)
      console.log("longitude")
    },
    []
  )

  return (
 <form>
     <MapboxAddressAutofill accessToken={TOKEN}  onRetrieve={handleRetrieve}>
      <input
        autoComplete="street-address"
        placeholder="Enter an address"
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </MapboxAddressAutofill>
 </form>
  )
}

