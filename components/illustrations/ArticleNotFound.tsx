export function ArticleNotFoundIllustration({
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
      <path
        d="M140 40c-44 0-80 28-80 62.5v55c0 8.3 6.7 15 15 15h130c8.3 0 15-6.7 15-15v-55c0-34.5-36-62.5-80-62.5Z"
        fill="var(--color-surface-muted)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <path
        d="M140 40v62.5c22 0 40 14.3 40 31.3v-55C180 68 164 40 140 40Z"
        fill="var(--color-surface-elevated)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      <circle
        cx="140"
        cy="115"
        r="18"
        fill="var(--color-surface)"
        stroke="var(--color-text-muted)"
        strokeWidth="2"
      />
      <path
        d="M140 106v6c0 1.1.9 2 2 2s2-.9 2-2v-3c0-1.7-1.3-3-3-3-1.1 0-2 .9-2 2Zm0 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="var(--color-text-muted)"
      />
      <path
        d="M95 85h50M95 95h35M95 105h45"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
