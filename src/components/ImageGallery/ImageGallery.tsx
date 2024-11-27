

import { useState } from 'react'
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: { src: string; alt: string }[]
}

export function ImageGallery({ images  }: ImageGalleryProps) {
   
 
  const [selectedIndex, setSelectedIndex] = useState(0)

  if(!images) return null

  console.log(images)

  return (
    <div className="">
      <div className="w-full">
        <img
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt}
      
          className="w-full"
        />
      </div>
      <div className="flex p-2 space-x-2 overflow-x-auto">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative w-16 h-16 flex-shrink-0",
              selectedIndex === index && "ring-2 ring-primary"
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
           
              className="object-cover rounded"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

