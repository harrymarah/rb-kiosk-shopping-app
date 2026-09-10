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
 *
 * `trim` covers a flaw in the supplied file rather than a design choice.
 * Banner 1 carries a 1px black border on its top and bottom edges - the look
 * of artwork that has been screenshotted rather than exported - and at the
 * size it renders that line is plainly visible. Scaling it up a fraction
 * pushes those two rows outside the slot. The other two files are clean and
 * are left untouched, so re-exported artwork drops in with no scaling.
 */
const BANNERS = [
  { id: 'wiiings', file: 'banners/Banner 1.jpg', alt: 'Red Bull gives you wiiings', trim: true },
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
                  style={banner.trim ? { transform: 'scale(1.008)' } : undefined}
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
