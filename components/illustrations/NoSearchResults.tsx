export function NoSearchResultsIllustration({
  className = "",
  width = 280,
  height = 200,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle
        cx="118"
        cy="82"
        r="38"
        fill="var(--color-surface)"
        stroke="var(--color-accent)"
        strokeWidth="3"
      />
      <path
        d="M145 109 175 139"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="118" cy="82" r="22" fill="var(--color-surface-muted)" />
      <path
        d="M100 92h120c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H100c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8Z"
        fill="var(--color-surface-elevated)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <path
        d="M112 108h40M112 120h56M112 132h32"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M175 118h25v6h-25zM175 130h20v6h-20z"
        fill="var(--color-surface-muted)"
      />
      <circle
        cx="160"
        cy="150"
        r="10"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
    </svg>
  );
}
