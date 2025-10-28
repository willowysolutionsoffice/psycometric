"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoChangeInterval?: number; // in milliseconds
}

export function ImageCarousel({ 
  images, 
  autoChangeInterval = 5000 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoChangeInterval);

    return () => clearInterval(interval);
  }, [images.length, autoChangeInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Content overlay */}
            {(image.title || image.description) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8 max-w-md">
                  {image.title && (
                    <h2 className="text-4xl font-bold mb-4">{image.title}</h2>
                  )}
                  {image.description && (
                    <p className="text-lg opacity-90">{image.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
