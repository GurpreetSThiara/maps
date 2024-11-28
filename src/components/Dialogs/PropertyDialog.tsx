"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

import { MapPin, Crop, Droplet, Sprout, Calendar, TrendingUp, Building, Zap } from "lucide-react"
import { PROPERTIES } from '@/lib/types'

export function PropertyDialog({ isOpen = true, onClose, property }:   {property:PROPERTIES, isOpen: boolean; onClose: () => void }) {
    console.log("first")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.placeName}</DialogTitle>
          <DialogDescription>{property.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {JSON.parse(property.images).map((image, index) => (
                  <CarouselItem key={index}>
                    <img src={image.src} alt={image.alt || `Property image ${index + 1}`} className="object-cover w-full h-64 rounded-lg" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="mt-4 space-y-2">
              <p className="text-lg font-semibold">₹{property.price.toLocaleString()} {property.priceFixed ? '(Fixed)' : ''}</p>
              <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {property.locationContext.locality}, {property.locationContext.place}, {property.locationContext.district}, {property.locationContext.region}, {property.locationContext.country}</p>
              <p className="flex items-center"><Crop className="w-4 h-4 mr-2" /> {property.area} acres</p>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2 text-lg font-semibold">Property Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="flex items-center"><Droplet className="w-4 h-4 mr-2" /> {property.waterSource}</p>
                  <p className="flex items-center"><Sprout className="w-4 h-4 mr-2" /> {property.soilType}</p>
                  <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Acquired: {property.yearAcquired}</p>
                  <p className="flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Yield: {property.yieldPerAcre} tons/acre</p>
                  <p className="flex items-center"><Building className="w-4 h-4 mr-2" /> Market: {property.distanceToMarket} km</p>
                  <p className="flex items-center"><Zap className="w-4 h-4 mr-2" /> {property.electricityAvailable ? 'Electricity available' : 'No electricity'}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2 text-lg font-semibold">Crop Information</h3>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(property.cropTypes).map((crop, index) => (
                    <Badge key={index} variant="secondary">{crop}</Badge>
                  ))}
                </div>
                <p className="mt-2">Last Harvest: {new Date(property.lastHarvest).toLocaleDateString()}</p>
                {property.organicCertified && <Badge className="mt-2" variant="outline">Organic Certified</Badge>}
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground">Owner: {property.ownerName} | Property ID: {property.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

