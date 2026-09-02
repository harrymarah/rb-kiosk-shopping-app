/** Parse "£4.75" to 4.75. Returns NaN for anything unparseable. */
export const toNumber = (price?: string): number =>
  parseFloat(String(price ?? '').replace(/[^0-9.]/g, ''));

/** Whole-pound and pence parts, so the pence can be set as a superscript. */
export const splitPrice = (price?: string): { pounds: string; pence: string } => {
  const value = toNumber(price);
  if (!isFinite(value)) return { pounds: '', pence: '' };
  const [pounds, pence = '00'] = value.toFixed(2).split('.');
  return { pounds, pence };
};

/** Percentage off, rounded, or null when there is no genuine reduction. */
export const percentOff = (price?: string, originalPrice?: string): number | null => {
  const now = toNumber(price);
  const was = toNumber(originalPrice);
  if (!isFinite(now) || !isFinite(was) || was <= now) return null;
  return Math.round((1 - now / was) * 100);
};

/**
 * Pack size read off the product name, so the shelf-edge unit price can be
 * shown the way a supermarket does it. Handles multipacks ("8 X 250ml",
 * "9x500ml"), plain weights/volumes ("570g", "2L") and counts ("6 Pack",
 * "9 Rolls", "44 Washes"). Returns null when the name says nothing usable.
 */
const parsePackSize = (name: string): { amount: number; unit: string } | null => {
  const n = name.toLowerCase();

  // Multipack: "8 x 250ml", "9x500ml", "4 X 1.5l"
  const multi = n.match(/(\d+)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(ml|l|g|kg)\b/);
  if (multi) {
    const [, count, size, unit] = multi;
    const total = Number(count) * Number(size);
    if (unit === 'ml') return { amount: total / 1000, unit: 'L' };
    if (unit === 'l') return { amount: total, unit: 'L' };
    if (unit === 'g') return { amount: total / 1000, unit: 'kg' };
    return { amount: total, unit: 'kg' };
  }

  // Countable packs: "6 Pack", "9 Rolls", "44 Washes", "10 Pack"
  const count = n.match(/(\d+)\s*(pack|rolls?|washes|sachets)\b/);
  if (count) return { amount: Number(count[1]), unit: 'unit' };

  // Single weight or volume: "570g", "1kg", "2L", "500ml"
  const single = n.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg)\b/);
  if (single) {
    const [, size, unit] = single;
    if (unit === 'ml') return { amount: Number(size) / 1000, unit: 'L' };
    if (unit === 'l') return { amount: Number(size), unit: 'L' };
    if (unit === 'g') return { amount: Number(size) / 1000, unit: 'kg' };
    return { amount: Number(size), unit: 'kg' };
  }

  return null;
};

/** e.g. "£1.80/L", "£0.32/unit". Null when the pack size can't be read. */
export const unitPrice = (price?: string, name?: string): string | null => {
  const value = toNumber(price);
  const pack = name ? parsePackSize(name) : null;
  if (!isFinite(value) || !pack || pack.amount <= 0) return null;

  const per = value / pack.amount;
  return `£${per < 1 ? per.toFixed(2) : per.toFixed(2)}/${pack.unit}`;
};
