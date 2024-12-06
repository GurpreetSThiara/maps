import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './Home/Home'
import Calc from './Calc/Calc'
import Usa from './Usa/Usa'
import PopulationDensity from './PopulationDensity/PopulationDensity'
import MapLogger from '@/components/MapLogger/MapLogger'

const CustomRoutes = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/calc' element={<Calc/>}/>
        <Route path='/usa' element={<Usa/>}/>
        <Route path='/zip' element={<PopulationDensity/>}/>
        <Route path='/log' element={<MapLogger/>}/>
     </Routes>
    </BrowserRouter>
  )
}

export default CustomRoutes