import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';

interface ZipDataProps {
  city: string;
  stateName: string;
  zipCode: string;
  timezone: string;
  population: number;
  density: number;
  stateId: string;
  coordinates: string;
}

const ZipData: React.FC = ({setCenter}) => {
  const zipData: ZipDataProps[] = useSelector((state: any) => state.zipdata.zipdata);
  const loading = useSelector((state: any) => state.zipdata.loading);
  const error = useSelector((state: any) => state.zipdata.error);

  if (loading) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading data: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 bg-gray-50" >
      {zipData && zipData.length > 0 ? (
        zipData.map(({ city, stateName, zipCode, timezone, population, density, stateId, coordinates }, index) => (
          <Card key={index} className="transition-transform transform bg-white border border-gray-200 rounded-lg shadow-md hover:scale-105">
            <CardHeader>
              <h5 className="text-gray-800">
                {city}, {stateName} ({zipCode})
              </h5>
              <h5  className="text-gray-500">
                <strong>Timezone:</strong> {timezone}
              </h5>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h6  className="text-gray-700">General Details</h6>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <strong>Population:</strong> {population}
                  </li>
                  <li>
                    <strong>Density:</strong> {density} per sq km
                  </li>
                  <li>
                    <strong>State:</strong> {stateName} ({stateId})
                  </li>
                </ul>
              </div>
              <div>
                <h6  className="text-gray-700">Coordinates</h6>
                <p className="text-gray-600">{coordinates}</p>
              </div>
              <div className="h-4"></div>
              <Button className='w-full rounded-2xl' onClick={()=>{
                setCenter(JSON.parse(coordinates))
              }}>Go To Location</Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500">No data available. Please try again.</p>
      )}
    </div>
  );
};

export default ZipData;