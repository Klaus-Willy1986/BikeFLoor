// Pre-configured bike shops with search URL templates
// {query} gets replaced with the component search term (e.g. "Shimano Ultegra Kette")

export interface BikeShop {
  id: string;
  name: string;
  domain: string;
  searchUrl: string;
  logo?: string;
}

export const BIKE_SHOPS: BikeShop[] = [
  {
    id: 'bike-discount',
    name: 'Bike-Discount',
    domain: 'bike-discount.de',
    searchUrl: 'https://www.bike-discount.de/en/search?search={query}',
  },
  {
    id: 'bike24',
    name: 'Bike24',
    domain: 'bike24.de',
    searchUrl: 'https://www.bike24.de/search?searchTerm={query}',
  },
  {
    id: 'bike-components',
    name: 'Bike-Components',
    domain: 'bike-components.de',
    searchUrl: 'https://www.bike-components.de/en/s/?keywords={query}',
  },
  {
    id: 'rose',
    name: 'Rose Bikes',
    domain: 'rosebikes.de',
    searchUrl: 'https://www.rosebikes.de/search?query={query}',
  },
  {
    id: 'hibike',
    name: 'HIBIKE',
    domain: 'hibike.com',
    searchUrl: 'https://hibike.com/?s={query}',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    domain: 'amazon.de',
    searchUrl: 'https://www.amazon.de/s?k={query}',
  },
];

export function getShopSearchUrl(shop: BikeShop, componentName: string, brand?: string | null, model?: string | null): string {
  const parts = [brand, model ?? componentName].filter(Boolean).join(' ');
  const query = encodeURIComponent(parts || componentName);
  return shop.searchUrl.replace('{query}', query);
}
