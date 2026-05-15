// Suppliers / Farmers management

const Suppliers = ({ goto, showToast }) => {
  const D = window.DATA;
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(null);
  const [filter, setFilter] = React.useState('all');

  const filtered = D.suppliers.filter(s => {
    if (filter === 'outstanding' && s.outstanding === 0) return false;
    if (filter === 'a' && s.credit !== 'A') return false;
    if (search && !s.name.includes(search) && !s.province.includes(search)) return false;
    return true;
  });

  const totalOutstanding = D.suppliers.reduce((s, x) => s + x.outstanding, 0);
  const totalVolume = D.suppliers.reduce((s, x) => s + x.total, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">ผู้ขาย / เกษตรกร</h1>
          <div className="page-sub">รวม <b className="n">{D.suppliers.length}</b> ราย · ค้างชำระทั้งหมด <b className="n" style={{color:'var(--bad)'}}>{baht(totalOutstanding)}</b> · มูลค่าซื้อสะสม <b className="n">{baht(totalVolume)}</b></div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14}/>ส่งออก Excel</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/>เพิ่มผู้ขายใหม่</button>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <Section title={`รายชื่อผู้ขาย (${filtered.length})`}>
          <div className="filter-row">
            <div className="filter-input" style={{ flex: 1, minWidth: 220 }}>
              <Icon name="search" size={14} className="muted"/>
              <input placeholder="ค้นหาชื่อ / จังหวัด" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="seg">
              <button className={filter==='all'?'active':''} onClick={() => setFilter('all')}>ทั้งหมด</button>
              <button className={filter==='outstanding'?'active':''} onClick={() => setFilter('outstanding')}>ค้างชำระ</button>
              <button className={filter==='a'?'active':''} onClick={() => setFilter('a')}>เครดิต A</button>
            </div>
          </div>
          <div>
            {filtered.map(s => (
              <div key={s.id} className="supplier-row" onClick={() => setSelected(s.id)} style={selected === s.id ? { background:'var(--primary-soft)' } : {}}>
                <div className="av">{s.name.substring(0,1)}</div>
                <div className="info">
                  <div className="row" style={{gap:8}}>
                    <b>{s.name}</b>
                    <Grade g={s.credit}/>
                  </div>
                  <span>{s.owner} · {s.province} · {s.phone}</span>
                </div>
                <div className="meta">
                  <div className="v">{bahtShort(s.total)}</div>
                  <div className="k">{s.orders} ครั้ง</div>
                </div>
                <div className="meta">
                  {s.outstanding > 0 ? <Pill kind="warn">ค้าง {bahtShort(s.outstanding)}</Pill> : <Pill kind="good">เคลียร์</Pill>}
                </div>
                <Icon name="chevron" size={14} className="muted"/>
              </div>
            ))}
          </div>
        </Section>

        <SupplierProfile id={selected || 'S0142'} showToast={showToast} goto={goto}/>
      </div>
    </div>
  );
};

const SupplierProfile = ({ id, showToast, goto }) => {
  const D = window.DATA;
  const s = D.suppById[id];
  const txns = D.transactions.filter(t => t.supplier === id);
  const [tab, setTab] = React.useState('overview');

  if (!s) return null;
  return (
    <Section title="ข้อมูลผู้ขาย" action={
      <button className="btn btn-ghost btn-sm"><Icon name="edit" size={12}/>แก้ไข</button>
    }>
      <div style={{ padding: 22, paddingBottom: 0 }}>
        <div className="row" style={{ gap: 14 }}>
          <div className="av" style={{ width: 56, height: 56, borderRadius:'50%', background:'var(--primary-soft)', color:'var(--primary)', display:'grid', placeItems:'center', fontWeight: 600, fontSize: 20 }}>
            {s.name.substring(0,1)}
          </div>
          <div style={{ flex: 1 }}>
            <div className="row" style={{ gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{s.name}</h2>
              <Grade g={s.credit}/>
            </div>
            <div className="muted" style={{ fontSize: 13 }}>{s.owner} · {s.province}</div>
            <div className="row" style={{ gap: 12, marginTop: 8, fontSize: 12 }}>
              <span className="muted">📞 {s.phone}</span>
              <span className="muted mono">ID: {s.id}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => goto('purchasing')}><Icon name="plus" size={12}/>สั่งซื้อใหม่</button>
        </div>

        <div className="grid-3" style={{ marginTop: 16, gap: 10 }}>
          <Mini label="ยอดซื้อสะสม" value={baht(s.total)} icon="coins"/>
          <Mini label="จำนวนครั้ง" value={s.orders + ' ครั้ง'} icon="cart"/>
          <Mini label="ค้างชำระ" value={baht(s.outstanding)} valueClass={s.outstanding > 0 ? 'bad' : 'good'} icon="payment"/>
        </div>
      </div>

      <div style={{ padding: '0 22px', marginTop: 16 }}>
        <div className="tabs">
          {[
            { id: 'overview', label: 'ภาพรวม' },
            { id: 'history', label: 'ประวัติการซื้อ' },
            { id: 'payment', label: 'การชำระเงิน' },
          ].map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <div style={{ padding: '4px 22px 22px' }}>
          <div style={{ fontSize: 12, color:'var(--muted)', fontWeight: 500, letterSpacing:'.04em', textTransform: 'uppercase', marginBottom: 10 }}>ผลไม้ที่รับซื้อ</div>
          <div className="row" style={{ flexWrap:'wrap', gap: 8 }}>
            {s.fruits.map(fid => <FruitChip key={fid} fruit={D.fruitById[fid]} sub={`เกรด A · ฿${40 + Math.round(Math.random()*60)}/กก.`} />)}
          </div>

          <div style={{ fontSize: 12, color:'var(--muted)', fontWeight: 500, letterSpacing:'.04em', textTransform: 'uppercase', margin: '20px 0 10px' }}>ข้อมูลธนาคาร</div>
          <div style={{ background:'var(--surface-2)', padding: 14, borderRadius: 10 }}>
            <div className="row" style={{ gap: 12 }}>
              <Icon name="bank" size={20} className="muted"/>
              <div style={{ flex: 1 }}>
                <div className="mono bold">{s.bank}</div>
                <div className="muted tiny">ชื่อบัญชี: {s.owner}</div>
              </div>
              <button className="btn btn-sm" onClick={() => showToast('คัดลอกเลขบัญชีแล้ว')}>คัดลอก</button>
            </div>
          </div>

          <div style={{ fontSize: 12, color:'var(--muted)', fontWeight: 500, letterSpacing:'.04em', textTransform: 'uppercase', margin: '20px 0 10px' }}>ยอดซื้อ 6 เดือนล่าสุด</div>
          <Sparkline data={[28000,42000,58000,82000,76000,94000]} w={400} h={60} />
        </div>
      )}

      {tab === 'history' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>เลขที่</th><th>วันที่</th><th>ผลไม้</th><th className="num">น้ำหนัก</th><th className="num">มูลค่า</th><th>สถานะ</th></tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id}>
                  <td className="row-id">{t.id}</td>
                  <td className="n tiny">{t.date}</td>
                  <td><FruitChip fruit={D.fruitById[t.fruit]}/></td>
                  <td className="num">{kg(t.kg)}</td>
                  <td className="num bold">{baht(t.total)}</td>
                  <td><StatusPill status={t.pay}/></td>
                </tr>
              ))}
              {txns.length === 0 && <tr><td colSpan="6" className="empty-state">ยังไม่มีประวัติ</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'payment' && (
        <div style={{ padding: '4px 22px 22px' }}>
          <div className="row" style={{ gap: 12, marginBottom: 14 }}>
            <Mini label="ชำระแล้ว (6 เดือน)" value={baht(s.total - s.outstanding)} icon="check"/>
            <Mini label="ค้างชำระ" value={baht(s.outstanding)} valueClass={s.outstanding > 0 ? 'bad' : 'good'} icon="payment"/>
          </div>
          {s.outstanding > 0 && (
            <button className="btn btn-accent" style={{ width:'100%' }} onClick={() => goto('payment')}>
              <Icon name="payment" size={14}/>ชำระเงินค้างชำระ {baht(s.outstanding)}
            </button>
          )}
        </div>
      )}
    </Section>
  );
};

window.Suppliers = Suppliers;
