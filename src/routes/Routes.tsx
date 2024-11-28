import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './Home/Home'
import Calc from './Calc/Calc'

const CustomRoutes = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/calc' element={<Calc/>}/>
     </Routes>
    </BrowserRouter>
  )
}

export default CustomRoutes