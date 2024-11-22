import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './Home/Home'

const CustomRoutes = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<Home/>}/>
     </Routes>
    </BrowserRouter>
  )
}

export default CustomRoutes