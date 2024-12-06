
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './Home/Home'

const AppRoutes = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<Home/>}/>
 
     </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes