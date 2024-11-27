// import React from 'react'
// import { Input } from '../ui/input';
// import { Sheet ,SheetTrigger,SheetContent,SheetHeader,SheetTitle } from '../ui/sheet';
// import { Button } from '../ui/button';
// import { ListFilter } from 'lucide-react';
// import { Select, SelectTrigger,SelectValue,SelectContent ,SelectItem} from '../ui/select';

// const Navbar = () => {
//   return (
//     <div className="sticky bg-white border-b">
//     <div className="container flex items-center gap-4 px-4 py-3 mx-auto">
//       <div className="flex items-center flex-1 gap-2">
//         <Input
//           type="text"
//           placeholder="Search by location or description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-md"
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//         />
//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="outline" size="icon">
//               <ListFilter className="w-4 h-4" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent>
//             <SheetHeader>
//               <SheetTitle>Filters</SheetTitle>
//             </SheetHeader>
//             <div className="grid gap-4 py-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Soil Type</label>
//                 <Select
//                   value={filters.soilType}
//                   onValueChange={(value) =>
//                     setFilters((f) => ({ ...f, soilType: value }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select soil type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {SOIL_TYPES.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Price Range</label>
//                 <Select
//                   value={filters.priceRange.label}
//                   onValueChange={(value) =>
//                     setFilters((f) => ({
//                       ...f,
//                       priceRange: PRICE_RANGES.find(
//                         (r) => r.label === value
//                       )!,
//                     }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select price range" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PRICE_RANGES.map((range) => (
//                       <SelectItem key={range.label} value={range.label}>
//                         {range.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Area (acres)</label>
//                 <div className="pt-2">
//                   <Slider
//                     defaultValue={[filters.minArea, filters.maxArea]}
//                     max={10}
//                     step={0.5}
//                     onValueChange={([min, max]) =>
//                       setFilters((f) => ({
//                         ...f,
//                         minArea: min,
//                         maxArea: max,
//                       }))
//                     }
//                     className="w-full"
//                   />
//                   <div className="flex justify-between mt-1 text-xs text-gray-500">
//                     <span>{filters.minArea} acres</span>
//                     <span>{filters.maxArea} acres</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Toggle
//                   pressed={filters.organic}
//                   onPressedChange={(pressed) =>
//                     setFilters((f) => ({ ...f, organic: pressed }))
//                   }
//                 >
//                   Organic Only
//                 </Toggle>
//               </div>
//               <Button
//                 onClick={() => {
//                   handleSearch();
//                   (document.querySelector("[data-sheet-close]") as HTMLElement)?.click();
//                 }}
//               >
//                 Apply Filters
//               </Button>
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>
//       <div className="flex items-center gap-2 p-1 border rounded-lg">
//         <Button
//           variant={viewMode === "map" ? "secondary" : "ghost"}
//           size="sm"
//           onClick={() => setViewMode("map")}
//         >
//           <MapIcon className="w-4 h-4 mr-2" />
//           Map
//         </Button>
//         <Button
//           variant={viewMode === "table" ? "secondary" : "ghost"}
//           size="sm"
//           onClick={() => setViewMode("table")}
//         >
//           <Table2 className="w-4 h-4 mr-2" />
//           Table
//         </Button>
//       </div>
//     </div>
//   </div>
//   )
// }

// export default Navbar