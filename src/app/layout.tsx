import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BikeFloor',
  description: 'Fahrrad-Wartungs- und Flottenmanagement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
