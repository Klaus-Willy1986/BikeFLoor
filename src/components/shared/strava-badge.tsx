import Image from 'next/image';

export function StravaBadge() {
  return (
    <a
      href="https://www.strava.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block hover:opacity-80 transition-opacity"
    >
      <Image
        src="/strava-powered-by.svg"
        alt="Powered by Strava"
        width={162}
        height={16}
        className="h-4 w-auto"
      />
    </a>
  );
}
