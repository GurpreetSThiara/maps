
import { Home, Map, BarChart2, Info } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '../ui/button'

const Header = () => {
  return (
    <header className="shadow-md bg-primary text-primary-foreground">
      <div className="container px-4 mx-auto">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center text-xl font-bold">
            <Map className="mr-2" />
            US States Density
          </div>
        
          <ul className="flex space-x-4">
            <li>
              <div className="flex items-center hover:text-secondary-foreground">
                <Home className="mr-1" size={18} />
                <span className="hidden sm:inline">Home</span>
              </div>
            </li>
            <li>
              <div  className="flex items-center hover:text-secondary-foreground">
                <Map className="mr-1" size={18} />
                <span className="hidden sm:inline">Map</span>
              </div>
            </li>
            <li>
              <div className="flex items-center hover:text-secondary-foreground">
                <BarChart2 className="mr-1" size={18} />
                <span className="hidden sm:inline">Statistics</span>
              </div>
            </li>
            <li>
              <div className="flex items-center hover:text-secondary-foreground">
                <Info className="mr-1" size={18} />
                <span className="hidden sm:inline">About</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
