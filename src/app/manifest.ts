import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BikeFloor',
    short_name: 'BikeFloor',
    description: 'Fahrrad-Wartungs- und Flottenmanagement',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F0E8',
    theme_color: '#2D5016',
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-192x192.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
