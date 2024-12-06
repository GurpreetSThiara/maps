"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, MapPin, ArrowUpDownIcon as ArrowsUpDown } from 'lucide-react'

interface DensityData {
  properties: {
    name: string;
    density_per_sq_km: number;
    population: number;
    area_sq_km: number;
  }
}

const EnhancedDensityCard = ({ data }: { data: DensityData }) => {
  const { properties } = data;

  // Calculate the density percentage (assuming max density is 10000 per sq km)
  const densityPercentage = Math.min(100, (properties.density_per_sq_km / 10000) * 100);

  // Format large numbers with commas
  const formatNumber = (num: number | undefined) => {
    return num !== undefined ? num.toLocaleString() : 'N/A';
  };

  // Function to determine density description
  const getDensityDescription = (density: number) => {
    if (density < 50) return "Sparsely populated";
    if (density < 200) return "Moderately populated";
    if (density < 1000) return "Densely populated";
    return "Extremely densely populated";
  };

  return (
    <Card className="w-full max-w-md transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {properties.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
              <circle cx="50" cy="50" r="45" fill="#e2e8f0" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="10" 
                strokeDasharray={`${densityPercentage * 2.827}, 1000`} />
              <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-3xl font-bold fill-current">
                {Math.round(densityPercentage)}%
              </text>
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">Density Meter</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ArrowsUpDown className="w-4 h-4" />
                Density
              </span>
              <span className="font-semibold">{formatNumber(properties.density_per_sq_km)} /km²</span>
            </div>
            <Progress value={densityPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">{getDensityDescription(properties.density_per_sq_km)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <Users className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Population</p>
              <p className="font-semibold">{formatNumber(properties.population)}</p>
            </div>
            <div>
              <MapPin className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="font-semibold">{formatNumber(properties.area_sq_km)} km²</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EnhancedDensityCard

