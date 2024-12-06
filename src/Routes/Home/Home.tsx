import Cards from '@/components/Cards/Cards'
import Map from '@/components/Map/Map'
import { getAllUSStates } from '@/redux/api/firebaseDb'
import { US_DENSITY_DATA_MERGED_COORDINATES } from '@/redux/data'
import { l } from 'node_modules/react-router/dist/development/fog-of-war-BkI3XFdx.d.mts'

import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  console.log("home Loaded ................")
  const [data,setData] = useState(US_DENSITY_DATA_MERGED_COORDINATES)
  return (
    <div>
        <div className="flex items-center justify-center w-full h-full gap-4 pt-4">
            <div className="w-[100vw] h-[80vh]">
                <Map data={data}/>
            </div>
            <div className="w-1/2 border h-[80vh] overflow-auto border-none bg-gray-100 rounded-lg">
                <Cards data={US_DENSITY_DATA_MERGED_COORDINATES}/>
            </div>
        </div>
    </div>
  )
}

export default memo(Home)