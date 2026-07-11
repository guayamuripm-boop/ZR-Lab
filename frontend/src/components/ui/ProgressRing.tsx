export interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({ progress, size = 96, strokeWidth = 8, label }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--glass-surface-2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: `stroke-dashoffset var(--duration-panel) var(--ease-liquid)` }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Roboto Mono, monospace',
          fontWeight: 500,
          color: 'var(--text-primary)',
          fontSize: size / 5,
        }}
      >
        {Math.round(clamped)}%
      </div>
      {label ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 4,
            fontSize: 13,
            color: 'var(--text-secondary)',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}
