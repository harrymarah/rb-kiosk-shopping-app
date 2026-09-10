import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getProductImageUrl } from '@/lib/image';

/**
 * The client's storefront banners, supplied at 800 x 333, so the slot is held
 * at that ratio and the artwork sits in it uncropped.
 */
const BANNERS = [
  { id: 'wiiings', file: 'banners/Banner 1.jpg', alt: 'Red Bull gives you wiiings' },
  { id: 'share', file: 'banners/Banner 2.jpg', alt: 'Wiiings to share — Red Bull Sugarfree 12 pack' },
  {
    id: 'winter',
    file: 'banners/Banner 3.jpg',
    alt: 'Wiiings for your winter — new Red Bull Winter Edition Sugarfree, Pistachio & Berries',
  },
];

const StorefrontBanners = () => (
  <section className="px-6 pt-6">
    <div className="container mx-auto max-w-4xl">
      <Carousel opts={{ align: 'start', loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {BANNERS.map((banner) => (
            <CarouselItem key={banner.id} className="pl-4">
              <div className="aspect-[800/333] rounded-2xl overflow-hidden bg-storefront">
                <img
                  src={getProductImageUrl(banner.file)}
                  alt={banner.alt}
                  className="w-full h-full object-cover"
                />
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
