import { Icon, type IconName } from './icon';

export function KPI({
  label,
  value,
  unit,
  delta,
  deltaDir = 'up',
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaDir?: 'up' | 'down';
  icon?: IconName;
  accent?: 'orange' | 'blue' | 'red';
}) {
  return (
    <div className={`kpi ${accent ? 'kpi-' + accent : ''}`}>
      <div className="kpi-accent" />
      <div className="kpi-label">
        {icon && <Icon name={icon} size={14} />} {label}
      </div>
      <div className="kpi-value n">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      <div className="kpi-foot">
        {delta != null && (
          <span className={`delta ${deltaDir}`}>
            {deltaDir === 'up' ? '↑' : '↓'} {delta}%
          </span>
        )}
        <span>vs สัปดาห์ก่อน</span>
      </div>
    </div>
  );
}
