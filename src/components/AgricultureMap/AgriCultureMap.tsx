"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { Heart, ListFilter, MapIcon, Table2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { PROPERTY_DATA } from "../../lib/data";
import { TOKEN } from "../../lib/constants";
import { cn } from "@/lib/utils";
import { PROPERTIES, PROPERTY } from "@/lib/types";
import { ImageGallery } from "../ImageGallery/ImageGallery";
import * as turf from "@turf/turf";
import { PropertyDialog } from "../Dialogs/PropertyDialog";

mapboxgl.accessToken = TOKEN;

const SOIL_TYPES = [
  "All Types",
  "Alluvial",
  "Loamy",
  "Sandy loam",
  "Clay loam",
  "Silt loam",
  "Rich loam",
];
const PRICE_RANGES = [
  { min: 0, max: 5000000, label: "Under ₹50L" },
  { min: 5000000, max: 10000000, label: "₹50L - ₹1Cr" },
  { min: 10000000, max: Infinity, label: "Above ₹1Cr" },
];

const EnhancedAgricultureMap: React.FC = () => {
  console.log("MAP RENDEREDDDDDDDDDDDDD");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<PROPERTIES | null>(
    null
  );
  const [visibleProperties, setVisibleProperties] = useState<PROPERTIES[]>([]);
  const [viewMode, setViewMode] = useState<"map" | "table">("map");
  const [filters, setFilters] = useState({
    soilType: "All Types",
    priceRange: PRICE_RANGES[0],
    organic: false,
    minArea: 0,
    maxArea: 10,
  });
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [showPropertyDialog , setShowPropertyDialog] = useState<boolean>(false);


  const closeDialog = () => setShowPropertyDialog(false);
  const openDialog = () => setShowPropertyDialog(true);

  useEffect(() => {
    if (mapContainerRef.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11",
      });

      const bbox = turf.bbox(PROPERTY_DATA);
      const centroid = turf.centroid(PROPERTY_DATA);
      const bboxPolygon = turf.bboxPolygon(bbox);
      console.log(bboxPolygon);
      console.log("bboxPolygon");

      const bounds = new mapboxgl.LngLatBounds();
      bboxPolygon.geometry.coordinates.forEach((coord) => bounds.extend(coord));

   

      map.current.on("load", () => {
        if (map.current) {
          map.current.fitBounds(bbox as [number, number, number, number], {
            padding: 50,
            maxZoom: 15,
          });


     
    
  
          map.current.addSource("properties", {
            type: "geojson",
            data: PROPERTY_DATA,
          });

          map.current.addSource("bbox", {
            type: "geojson",
            data: bboxPolygon,
          });

          map.current.addLayer({
            id: "bbox-layer",
            type: "line",
            source: "bbox",
            paint: {
              "line-color": "#ff0000", // Line color for the bounding box
              "line-width": 2, // Line width for the bounding box
            },
          });

          map.current.addLayer({
            id: "clusters",
            type: "circle",
            source: "properties",
            // filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#60a5fa",
                5,
                "#3b82f6",
                10,
                "#2563eb",
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                5,
                30,
                10,
                40,
              ],
            },
          });

          map.current.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "properties",
            // filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            },
            paint: {
              "text-color": "#ffffff",
            },
          });

          map.current.addLayer({
            id: "property-layer",
            type: "fill",
            source: "properties",
            paint: {
              "fill-color": [
                "match",
                ["get", "soilType"],
                "Alluvial",
                "#93c5fd",
                "Loamy",
                "#86efac",
                "Sandy loam",
                "#fde68a",
                "Clay loam",
                "#fdba74",
                "Silt loam",
                "#c4b5fd",
                "Rich loam",
                "#a5b4fc",
                "#e2e8f0",
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.8,
                0.6,
              ],
            },
          });

          // Add property outline layer
          map.current.addLayer({
            id: "property-outline",
            type: "line",
            source: "properties",
            paint: {
              "line-color": "#1e40af",
              "line-width": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                2,
                1,
              ],
            },
          });

          // Handle property clicks
          map.current.on("click", "property-layer", (e) => {
            if (e.features && e.features[0].properties) {
              const properties = e.features[0].properties;
              setSelectedProperty(properties as PROPERTIES);
            }
          });

          // Handle mouse enter/leave for hover effects
          let hoveredStateId: string | null = null;

          map.current.on("mousemove", "property-layer", (e) => {
            if (e.features && e.features.length > 0) {
              if (hoveredStateId !== null) {
                map.current!.setFeatureState(
                  { source: "properties", id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = e.features[0].id as string;
              map.current!.setFeatureState(
                { source: "properties", id: hoveredStateId },
                { hover: true }
              );
            }
          });

          map.current.on("mouseleave", "property-layer", () => {
            if (hoveredStateId !== null) {
              map.current!.setFeatureState(
                { source: "properties", id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = null;
          });

          // Update visible properties on map move
          map.current.on("moveend", updateVisibleProperties);
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const handlePropertyClick = (center) => {
    console.log(center);
    console.log(typeof center);
    console.log(typeof center[0]);
    const centerArray = JSON.parse(center);

    console.log("handlePropertyClick called with:", center);

    if (map.current) {
      try {
        map.current.flyTo({
          center: centerArray,
          zoom: 16,
        });
      } catch (error) {
        console.error("Error flying to location:", error);
      }
    } else {
      console.error("Map instance is null or undefined");
    }
  };

  const updateVisibleProperties = () => {
    if (map.current) {
      const features = map.current.queryRenderedFeatures({
        layers: ["property-layer"],
      });

      console.log(features);
      console.log("features");

      const uniqueFeatures = features.filter((feature, index) => {
        const id = feature.properties?.id;
        return features.findIndex((f) => f.properties?.id === id) === index;
      });

      setVisibleProperties(
        uniqueFeatures.map((f) => f.properties!) as PROPERTIES[]
      );

      console.log(uniqueFeatures);
    }
  };

  const handleSearch = () => {
    const filteredFeatures = PROPERTY_DATA.features.filter((feature) => {
      const props = feature.properties;
      if (props) {
        const matchesSearch =
          props.placeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          props.description.toLowerCase().includes(searchTerm.toLowerCase());

          console.log(matchesSearch)
        const matchesSoilType =
          filters.soilType === "All Types" ||
          props.soilType === filters.soilType;
        const matchesPrice =
          props.price >= filters.priceRange.min &&
          props.price <= filters.priceRange.max;
        const matchesOrganic = !filters.organic || props.organicCertified;
        const matchesArea =
          props.area >= filters.minArea && props.area <= filters.maxArea;

        return (
          matchesSearch 
          // &&
          // matchesSoilType &&
          // matchesPrice &&
          // matchesOrganic &&
          // matchesArea
        );
      }
    });

    if (map.current && map.current.isStyleLoaded()) {
      const source = map.current.getSource(
        "properties"
      ) as mapboxgl.GeoJSONSource;
      source.setData({
        type: "FeatureCollection",
        features: filteredFeatures,
      });

      if (filteredFeatures.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        filteredFeatures.forEach((feature) => {
          if (
            feature.geometry.type === "Point" ||
            feature.geometry.type === "Polygon"
          ) {
            const coords = feature.geometry.coordinates[0];
            if (Array.isArray(coords)) {
              coords.forEach((coord: number[]) => {
                bounds.extend(coord as [number, number]);
              });
            }
          }
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  };

  const toggleSavedProperty = (id: string) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PropertyCard = ({ property, center }: { property: any }) => {
    console.log(property);
    return (
      <div className="overflow-auto bg-white rounded-lg shadow-md">
        <ImageGallery images={JSON.parse(property.images)} />

        <div className="relative bg-gray-200">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => toggleSavedProperty(property.id)}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                savedProperties.includes(property.id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500"
              )}
            />
          </Button>
        </div>
        <div className="p-4" onClick={openDialog}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold">
                ₹{(property.price / 100000).toFixed(1)}L
              </h3>
              <p className="text-sm text-gray-600">{property.placeName}</p>
            </div>
            <span>{property.organicCertified ? "Organic" : "Non-Organic"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>Area: {property.area} acres</div>
            <div>Soil: {property.soilType}</div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {property.description}
          </p>
        </div>
        <div className="w-full border">
          <Button
            variant={"ghost"}
            className="w-full"
            onClick={() => {
              handlePropertyClick(property.center);
            }}
          >
            Go To Location
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="sticky bg-white border-b">
        <div className="container flex items-center gap-4 px-4 py-3 mx-auto">
        <div className="">
              <h1 className="text-2xl font-bold">AgriEstate</h1>
            </div>
          <div className="flex items-center flex-1 gap-2">
          
            <Input
              type="text"
              placeholder="Search by location or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <ListFilter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Soil Type</label>
                    <Select
                      value={filters.soilType}
                      onValueChange={(value) =>
                        setFilters((f) => ({ ...f, soilType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOIL_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <Select
                      value={filters.priceRange.label}
                      onValueChange={(value) =>
                        setFilters((f) => ({
                          ...f,
                          priceRange: PRICE_RANGES.find(
                            (r) => r.label === value
                          )!,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICE_RANGES.map((range) => (
                          <SelectItem key={range.label} value={range.label}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Area (acres)</label>
                    <div className="pt-2">
                      <Slider
                        defaultValue={[filters.minArea, filters.maxArea]}
                        max={10}
                        step={0.5}
                        onValueChange={([min, max]) =>
                          setFilters((f) => ({
                            ...f,
                            minArea: min,
                            maxArea: max,
                          }))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{filters.minArea} acres</span>
                        <span>{filters.maxArea} acres</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Toggle
                      pressed={filters.organic}
                      onPressedChange={(pressed) =>
                        setFilters((f) => ({ ...f, organic: pressed }))
                      }
                    >
                      Organic Only
                    </Toggle>
                  </div>
                  <Button
                    onClick={() => {
                      handleSearch();
                      (
                        document.querySelector(
                          "[data-sheet-close]"
                        ) as HTMLElement
                      )?.click();
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2 p-1 border rounded-lg">
            <Button
              variant={viewMode === "map" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Map
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <Table2 className="w-4 h-4 mr-2" />
              Table
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1">
        {viewMode === "map" ? (
          <>
            <div className="flex-1 h-[90%] relative " ref={mapContainerRef}>
              {selectedProperty && (
                <div className="absolute z-10 top-4 right-4 w-80">
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          ₹{(selectedProperty.price / 100000).toFixed(1)}L
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedProperty.placeName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedProperty(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">{selectedProperty.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Area:</span>{" "}
                          {selectedProperty.area} acres
                        </div>
                        <div>
                          <span className="font-medium">Soil:</span>{" "}
                          {selectedProperty.soilType}
                        </div>
                        <div>
                          <span className="font-medium">Owner:</span>{" "}
                          {selectedProperty.ownerName}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {selectedProperty.organicCertified
                            ? "Organic"
                            : "Non-Organic"}
                        </div>
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={() => toggleSavedProperty(selectedProperty.id)}
                      >
                        <Heart />
                        {savedProperties.includes(selectedProperty.id)
                          ? "Saved"
                          : "Save Property"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="h-screen overflow-auto bg-white border-l w-96">
              <div className="p-4 space-y-4">
                {visibleProperties.map((property, index) => (
                 <>
                  <PropertyCard
                    key={property.id || index}
                    property={property}
                  />
                  <PropertyDialog property={property} isOpen={showPropertyDialog} onClose={closeDialog}/>
                 </>
                ))}
              </div>
            </div>
          
          </>
        ) : (
          <div className="flex-1 p-4 bg-white">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleProperties.map((property, index) => (
                  <PropertyCard
                    key={property.id || index}
                    property={property}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAgricultureMap;
