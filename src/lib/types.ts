interface LocationContext {
    locality: string;
    place: string;
    district: string;
    region: string;
    country: string;
  }
  
  export interface PROPERTIES {
    images:string[]
    id: string;
    postalCode: string;
    placeName: string;
    description: string;
    ownerName: string;
    price: number;
    priceFixed: boolean;
    area: number; // in acres
    soilType: string;
    waterSource: string;
    cropTypes: string[];
    organicCertified: boolean;
    yearAcquired: number;
    lastHarvest: string; // ISO date string
    yieldPerAcre: number; // in tons
    nearestMarket: string;
    distanceToMarket: number; // in km
    roadAccess: string;
    electricityAvailable: boolean;
    center: [number, number]; // [longitude, latitude]
    locationContext: LocationContext;
  }
  
  interface Geometry {
    type: "Polygon";
    coordinates: [number, number][][];
  }
  
  export interface PROPERTY {
    type: "Feature";
    geometry: Geometry;
    properties: PROPERTIES;
  }
  