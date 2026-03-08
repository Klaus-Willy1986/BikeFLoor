import { setRequestLocale } from 'next-intl/server';
import { Bike } from 'lucide-react';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel — hidden on mobile */}
      <div className="relative hidden w-[45%] overflow-hidden bg-[#0a0c12] lg:flex lg:flex-col lg:justify-between">
        {/* Decorative glows */}
        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-amber-500/[0.07] blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full bg-amber-500/[0.04] blur-3xl" />
        <div className="absolute right-12 bottom-40 h-48 w-48 rounded-full border border-amber-500/10" />

        {/* Carbon/topo pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.15]">
            <defs>
              <filter id="topo-auth" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feTurbulence type="turbulence" baseFrequency="0.008 0.006" numOctaves="5" seed="8" stitchTiles="stitch" result="noise" />
                <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
                <feComponentTransfer in="gray" result="bands">
                  <feFuncR type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
                  <feFuncG type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
                  <feFuncB type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
                </feComponentTransfer>
                <feMorphology operator="erode" radius="1" in="bands" result="thin" />
                <feComposite operator="out" in="bands" in2="thin" result="edges" />
                <feColorMatrix type="matrix" in="edges" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 1 0" />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#topo-auth)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-6 p-10 pt-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 ring-1 ring-amber-500/30">
              <Bike className="h-6 w-6 text-amber-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              BikeFloor
            </span>
          </div>
        </div>

        <div className="relative z-10 p-10 pb-12">
          <blockquote className="space-y-3">
            <p className="text-lg leading-relaxed text-white/80">
              Behalte den Verschleiß deiner Komponenten im Blick, plane Wartungen
              rechtzeitig und dokumentiere jede Fahrt.
            </p>
            <footer className="text-sm font-medium text-amber-400/60">
              Dein digitaler Werkstatt-Assistent
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right: Form area */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f4f5f7] p-6 sm:p-10">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a0c12]">
            <Bike className="h-6 w-6 text-amber-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">BikeFloor</span>
        </div>

        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
