export interface BadgeCardProps {
  name: string;
  icon?: string;
  earned?: boolean;
}

export function BadgeCard({ name, icon = '🔧', earned = false }: BadgeCardProps) {
  return (
    <div
      className="glass"
      style={{
        width: 96,
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: earned ? 1 : 0.45,
        border: earned ? '1px solid var(--gold)' : undefined,
        boxShadow: earned ? '0 0 20px rgba(232, 196, 104, 0.35)' : undefined,
        transition: `box-shadow var(--duration-panel) var(--ease-liquid), opacity var(--duration-panel) var(--ease-liquid)`,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 28 }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 12,
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}
      >
        {name}
      </span>
    </div>
  );
}
