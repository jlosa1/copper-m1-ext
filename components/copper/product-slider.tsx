"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Slide = {
  id: string;
  caption: string;
  images: { src: string; alt: string }[];
};

// The server page builds the slides from the catalog; this component only
// handles which slide is showing. No autoplay, so nothing moves while someone
// is reading.
export function ProductSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = (next: number) => setIndex((next + count) % count);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  }

  return (
    <section
      data-testid="product-slider"
      aria-roledescription="carousel"
      aria-label="Copper products"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="bg-secondary text-secondary-foreground focus-visible:ring-primary outline-none focus-visible:ring-2 focus-visible:ring-inset"
    >
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, slideIndex) => (
              <figure
                key={slide.id}
                data-testid="slide"
                data-slide={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}`}
                aria-hidden={slideIndex !== index}
                inert={slideIndex !== index}
                className="flex w-full shrink-0 flex-col items-center gap-4"
              >
                <div className="flex items-center justify-center gap-4 sm:gap-8">
                  {slide.images.map((image) => (
                    <Image
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      width={1254}
                      height={1254}
                      sizes="(min-width: 640px) 288px, 40vw"
                      className="h-40 w-auto sm:h-72"
                    />
                  ))}
                </div>
                <figcaption className="text-center text-xl font-medium">
                  {slide.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <div className="flex gap-2">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${slideIndex + 1}`}
                aria-current={slideIndex === index}
                onClick={() => go(slideIndex)}
                className={`size-3 rounded-full border border-primary ${
                  slideIndex === index ? "bg-primary" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
