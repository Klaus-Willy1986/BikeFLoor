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
      <div className="relative hidden w-[45%] overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between">
        {/* Decorative circles */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-[500px] w-[500px] rounded-full bg-white/[0.03]" />
        <div className="absolute right-12 bottom-40 h-48 w-48 rounded-full border border-white/10" />

        <div className="relative z-10 flex flex-col gap-6 p-10 pt-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Bike className="h-6 w-6 text-white" />
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
            <footer className="text-sm font-medium text-white/50">
              Dein digitaler Werkstatt-Assistent
            </footer>
          </blockquote>
        </div>

        {/* Bike silhouette SVG */}
        <div className="absolute bottom-0 right-0 opacity-[0.06]">
          <svg width="420" height="300" viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="200" r="75" stroke="white" strokeWidth="6"/>
            <circle cx="320" cy="200" r="75" stroke="white" strokeWidth="6"/>
            <circle cx="100" cy="200" r="8" fill="white"/>
            <circle cx="320" cy="200" r="8" fill="white"/>
            <path d="M100 200 L180 80 L240 80 L320 200" stroke="white" strokeWidth="5" strokeLinejoin="round"/>
            <path d="M180 80 L160 200" stroke="white" strokeWidth="5"/>
            <path d="M240 80 L320 200" stroke="white" strokeWidth="5"/>
            <path d="M230 80 L260 50" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M250 50 L270 50" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="210" cy="80" r="14" stroke="white" strokeWidth="4"/>
          </svg>
        </div>
      </div>

      {/* Right: Form area */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-10">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bike className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">BikeFloor</span>
        </div>

        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
