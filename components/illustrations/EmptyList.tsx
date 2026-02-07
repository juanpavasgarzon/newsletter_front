export function EmptyListIllustration({
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
      <ellipse
        cx="140"
        cy="165"
        rx="55"
        ry="8"
        fill="var(--color-surface-muted)"
      />
      <path
        d="M115 165v-52c0-4 3-7 7-7h36c4 0 7 3 7 7v52"
        stroke="var(--color-border)"
        strokeWidth="2.5"
        fill="var(--color-surface-elevated)"
      />
      <path
        d="M122 113h36c2.2 0 4 1.8 4 4v38c0 2.2-1.8 4-4 4h-36c-2.2 0-4-1.8-4-4v-38c0-2.2 1.8-4 4-4Z"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <path
        d="M132 128h24M132 138h18M132 148h22"
        stroke="var(--color-border)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle
        cx="140"
        cy="72"
        r="24"
        fill="var(--color-surface-muted)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <circle cx="134" cy="68" r="2.5" fill="var(--color-text-muted)" />
      <circle cx="146" cy="68" r="2.5" fill="var(--color-text-muted)" />
      <path
        d="M134 80c0 3.3 2.7 6 6 6s6-2.7 6-6"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
