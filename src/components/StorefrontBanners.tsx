import { ImageIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

/**
 * Placeholder slots for the storefront banners, which the client is still
 * choosing. Correct proportions and position so the layout can be reviewed,
 * but deliberately labelled so nobody mistakes them for final artwork.
 * Replace `BANNER_SLOTS` with real images when they arrive.
 */
const BANNER_SLOTS = [
  { id: 'primary', label: 'Primary storefront banner', ratio: '1440 × 480' },
  { id: 'secondary', label: 'Secondary banner', ratio: '1440 × 480' },
  { id: 'seasonal', label: 'Seasonal / campaign banner', ratio: '1440 × 480' },
];

const StorefrontBanners = () => (
  <section className="px-6 pt-6">
    <div className="container mx-auto max-w-4xl">
      <Carousel opts={{ align: 'start', loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {BANNER_SLOTS.map((slot) => (
            <CarouselItem key={slot.id} className="pl-4">
              <div className="relative aspect-[3/1] rounded-2xl overflow-hidden bg-storefront">
                {/* Subtle diagonal hatch so an empty slot still reads as a banner */}
                <div
                  className="absolute inset-0 opacity-[0.13]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 14px)',
                  }}
                />
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                  <ImageIcon className="w-7 h-7 text-storefront-muted mb-3" />
                  <p className="font-display text-lg font-bold text-storefront-foreground">
                    {slot.label}
                  </p>
                  <p className="text-sm text-storefront-muted mt-1">
                    Artwork to follow — {slot.ratio}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </section>
);

export default StorefrontBanners;
