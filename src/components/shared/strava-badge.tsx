export function StravaBadge() {
  return (
    <a
      href="https://www.strava.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#FC4C02] hover:opacity-80 transition-opacity"
    >
      Powered by
      <svg
        viewBox="0 0 561 107"
        fill="currentColor"
        className="h-3"
        aria-label="Strava"
      >
        <path d="M91.4 32.5c-6.6-8.5-16.8-13.3-28.1-13.3-19.5 0-35.3 15.8-35.3 35.3s15.8 35.3 35.3 35.3c11.3 0 21.5-4.8 28.1-13.3l-15.1-11.7c-3.1 4-7.6 6.3-13 6.3-9 0-16.5-7.5-16.5-16.5S54.3 38 63.3 38c5.3 0 9.9 2.3 13 6.3l15.1-11.8zm28.6-13.3h-18.8v69.2h18.8V19.2zM197 19.2l-22.8 69.2h19.6l13.2-43.8 13.2 43.8h19.6L217.1 19.2H197zm-48.2 0h-47.4v18.1h14.3v51.1h18.8V37.3h14.3V19.2zm167.8 0l-22.8 69.2h19.6l13.2-43.8 13.2 43.8h19.6L336.7 19.2h-20.1zm112.6 0L398.7 88.4h19.6l13.2-43.8 13.2 43.8h19.6L441.5 19.2h-12.3zm-69.7 0l-30.5 69.2h20.5l5-12.3h30.8l5 12.3h20.5l-30.5-69.2h-20.8zm3.2 40.5l8.2-20.4 8.2 20.4h-16.4zM488 19.2l-30.5 69.2h20.5l5-12.3h30.8l5 12.3h20.5L509 19.2h-21zm3.2 40.5l8.2-20.4 8.2 20.4h-16.4z" />
      </svg>
    </a>
  );
}
