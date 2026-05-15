import type { Fruit } from '@/lib/types';

export function FruitDot({ fruit, size = 26 }: { fruit: Fruit; size?: number }) {
  return (
    <span
      className="fruit-dot"
      style={{
        background: fruit.color,
        width: size,
        height: size,
        fontSize: Math.max(10, size * 0.42),
      }}
    >
      {fruit.code}
    </span>
  );
}

export function FruitChip({ fruit, sub }: { fruit: Fruit; sub?: string }) {
  return (
    <div className="fruit-chip">
      <FruitDot fruit={fruit} />
      <div>
        <div style={{ fontWeight: 500 }}>{fruit.name}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>}
      </div>
    </div>
  );
}
