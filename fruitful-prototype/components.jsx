// Icons + shared components

const Icon = ({ name, size = 18, className = "" }) => {
  const paths = {
    dashboard:  <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    cart:       <><path d="M3 4h2l2.5 11h11l2-8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>,
    users:      <><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M21 19c0-2.4-1.6-4-4-4"/></>,
    warehouse:  <><path d="M3 10l9-6 9 6v10H3z"/><path d="M3 14h18"/><path d="M9 20v-6h6v6"/></>,
    payment:    <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18"/><path d="M7 16h4"/></>,
    book:       <><path d="M4 4v15a2 2 0 0 0 2 2h13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></>,
    box:        <><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>,
    chart:      <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M20 20H4"/></>,
    mobile:     <><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></>,
    search:     <><circle cx="11" cy="11" r="6"/><path d="m20 20-3.5-3.5"/></>,
    bell:       <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
    plus:       <><path d="M12 5v14M5 12h14"/></>,
    filter:     <><path d="M4 5h16l-6 8v6l-4-2v-4z"/></>,
    download:   <><path d="M12 4v12m-5-5l5 5 5-5"/><path d="M4 20h16"/></>,
    print:      <><rect x="6" y="3" width="12" height="6"/><path d="M6 17H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7"/></>,
    truck:      <><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
    sparkle:    <><path d="M12 3v6m0 6v6M3 12h6m6 0h6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/></>,
    check:      <><path d="M5 12l4 4 10-10"/></>,
    x:          <><path d="M6 6l12 12M18 6L6 18"/></>,
    arrow:      <><path d="M5 12h14m-6-6l6 6-6 6"/></>,
    leaf:       <><path d="M20 4S10 3 6 8s-2 13-2 13 8 0 13-5 3-12 3-12z"/><path d="M4 21s4-9 14-15"/></>,
    coins:      <><ellipse cx="9" cy="8" rx="6" ry="3"/><path d="M3 8v4c0 1.7 2.7 3 6 3s6-1.3 6-3V8"/><path d="M9 15v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-8c0-1.4-1.8-2.5-4-2.9"/></>,
    weight:     <><path d="M5 7h14l-2 13H7z"/><path d="M9 7a3 3 0 1 1 6 0"/></>,
    qr:         <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M14 20h7"/><path d="M20 14v3"/></>,
    cash:       <><rect x="3" y="6" width="18" height="12" rx="1"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></>,
    bank:       <><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 21V10m4 11V10m6 11V10m4 11V10"/><path d="M12 3 3 8h18z"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    upload:     <><path d="M12 16V4m-5 5l5-5 5 5"/><path d="M4 20h16"/></>,
    camera:     <><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/></>,
    edit:       <><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></>,
    eye:        <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    trash:      <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
    more:       <><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></>,
    star:       <><path d="m12 3 2.6 6 6.4.6-5 4.3 1.6 6.1L12 17l-5.6 3 1.6-6.1-5-4.3 6.4-.6z"/></>,
    map:        <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></>,
    thermo:     <><path d="M10 14V5a2 2 0 0 1 4 0v9"/><circle cx="12" cy="17" r="3"/><path d="M12 14v3"/></>,
    cloud:      <><path d="M7 18a5 5 0 0 1 0-10 7 7 0 0 1 13.5 2.5A4 4 0 0 1 19 18z"/></>,
    target:     <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    burger:     <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    chevron:    <><path d="m9 6 6 6-6 6"/></>,
    chevronD:   <><path d="m6 9 6 6 6-6"/></>,
    play:       <><path d="M6 4v16l14-8z"/></>,
    pause:      <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
  };
  return (
    <svg className={`ic ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

const FruitDot = ({ fruit, size = 26 }) => (
  <span className="fruit-dot" style={{ background: fruit.color, width: size, height: size, fontSize: Math.max(10, size * 0.42) }}>
    {fruit.code}
  </span>
);

const FruitChip = ({ fruit, sub }) => (
  <div className="fruit-chip">
    <FruitDot fruit={fruit} />
    <div>
      <div style={{ fontWeight: 500 }}>{fruit.name}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>}
    </div>
  </div>
);

const Pill = ({ children, kind = "" }) => <span className={`pill ${kind}`}>{children}</span>;

const Grade = ({ g }) => <span className={`grade ${g}`}>{g}</span>;

const StatusPill = ({ status }) => {
  const map = {
    paid:     { kind: 'good', label: 'ชำระแล้ว' },
    pending:  { kind: 'warn', label: 'รอชำระ' },
    partial:  { kind: 'info', label: 'ผ่อนชำระ' },
    approval: { kind: 'accent', label: 'รออนุมัติ' },
    scheduled:{ kind: '',     label: 'จัดคิวแล้ว' },
  };
  const m = map[status] || { kind: '', label: status };
  return <Pill kind={m.kind}><span className="dot"></span>{m.label}</Pill>;
};

const PayMethod = ({ m }) => {
  const map = {
    transfer: { icon: 'bank',    label: 'โอนธนาคาร' },
    qr:       { icon: 'qr',      label: 'QR Pay' },
    cash:     { icon: 'cash',    label: 'เงินสด' },
  };
  const v = map[m] || { icon: 'coins', label: m };
  return <span style={{ display:'inline-flex', alignItems:'center', gap: 6, fontSize: 12.5 }}>
    <Icon name={v.icon} size={14} /> {v.label}
  </span>;
};

const baht = n => '฿' + n.toLocaleString('en-US');
const bahtShort = n => {
  if (n >= 1000000) return '฿' + (n/1000000).toFixed(2) + 'M';
  if (n >= 1000) return '฿' + (n/1000).toFixed(1) + 'k';
  return '฿' + n.toLocaleString('en-US');
};
const kg = n => n.toLocaleString('en-US') + ' กก.';

// ----- KPI -----
const KPI = ({ label, value, unit, delta, deltaDir = 'up', icon, sparkData, accent }) => (
  <div className={`kpi ${accent ? 'kpi-' + accent : ''}`}>
    <div className="kpi-accent"></div>
    <div className="kpi-label">
      {icon && <Icon name={icon} size={14} />} {label}
    </div>
    <div className="kpi-value n">
      {value}{unit && <span className="unit">{unit}</span>}
    </div>
    <div className="kpi-foot">
      {delta != null && (
        <span className={`delta ${deltaDir}`}>
          {deltaDir === 'up' ? '↑' : '↓'} {delta}%
        </span>
      )}
      <span>vs สัปดาห์ก่อน</span>
    </div>
    {sparkData && <Sparkline data={sparkData} className="kpi-spark" w={84} h={32} />}
  </div>
);

const Sparkline = ({ data, w = 84, h = 32, className = "", stroke = "var(--primary)", fill = "var(--primary-soft)" }) => {
  if (!data || !data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = Math.max(1, max - min);
  const dx = w / (data.length - 1);
  const pts = data.map((v, i) => [i * dx, h - ((v - min) / range) * (h - 4) - 2]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = path + ` L${w},${h} L0,${h} Z`;
  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={area} fill={fill} opacity=".5" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
};

// ----- Section -----
const Section = ({ title, action, children, sub }) => (
  <div className="card">
    {(title || action) && (
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          {sub && <div className="muted tiny" style={{ marginTop: 2 }}>{sub}</div>}
        </div>
        {action && <div className="right">{action}</div>}
      </div>
    )}
    {children}
  </div>
);

// ----- Modal -----
const Modal = ({ open, onClose, title, children, footer, size }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${size === 'lg' ? 'modal-lg' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

// ----- Toast (simple) -----
const Toast = ({ msg }) => msg ? (
  <div className="toast">
    <Icon name="check" size={16} />
    <span>{msg}</span>
  </div>
) : null;

Object.assign(window, {
  Icon, FruitDot, FruitChip, Pill, Grade, StatusPill, PayMethod,
  baht, bahtShort, kg, KPI, Sparkline, Section, Modal, Toast,
});
