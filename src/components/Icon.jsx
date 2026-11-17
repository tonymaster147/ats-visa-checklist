const PATHS = {
  id: 'M3 5h18v14H3zM7 9h4M7 13h6M15 9.5a1.5 1.5 0 1 0 0 .01M14 15h3',
  wallet: 'M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-3v3M16 13h2',
  briefcase: 'M3 8h18v11H3zM8 8V5h8v3M3 13h18',
  target: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10M12 11a1 1 0 1 0 0 2a1 1 0 1 0 0-2',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  heart: 'M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2a4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9z',
  users: 'M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14c2.5.7 4 3 4 6',
  plane: 'M10.5 13.5L3 11l1.5-1.5 7.5 1L16.5 6c1-1 2.5-1.5 3-1s0 2-1 3l-4.5 4.5 1 7.5L13.5 21 11 13.5z',
  shield: 'M12 3l8 3v6c0 4.5-3.5 8-8 9c-4.5-1-8-4.5-8-9V6zM9 12l2 2 4-4',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevron: 'M9 6l6 6-6 6',
  back: 'M15 6l-6 6 6 6',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 11v6M12 7.5v.01',
  alert: 'M12 3l10 18H2zM12 10v5M12 18v.01',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  printer: 'M7 8V3h10v5M5 17H3v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7h-2M7 14h10v7H7z',
  reset: 'M4 4v6h6M20 12a8 8 0 0 1-14.3 5M4 10a8 8 0 0 1 14.3-3',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  translate: 'M3 5h10M8 3v2M5 5c1 4 4 7 7 8M11 5c-1 4-4 7-7 8M13 21l4-9 4 9M14.5 18h5',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13l2 2 4-4',
};

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={`atsvc-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name] || PATHS.doc} />
    </svg>
  );
}
