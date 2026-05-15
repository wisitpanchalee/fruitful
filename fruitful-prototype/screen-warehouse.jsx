// Warehouse — zone map + stock

const Warehouse = ({ goto }) => {
  const D = window.DATA;
  const [warehouse, setWarehouse] = React.useState('WH-A');
  const [selectedZone, setSelectedZone] = React.useState('B-04');

  const zones = D.zones;
  const totalKg = zones.reduce((s,z)=>s+z.kg,0);
  const totalCap = zones.reduce((s,z)=>s+z.cap,0);
  const empty = zones.filter(z => z.type === 'empty').length;

  const zone = zones.find(z => z.id === selectedZone) || zones[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">คลังสินค้า</h1>
          <div className="page-sub">
            จัดการสต็อกและโซนเก็บผลไม้ · ใช้พื้นที่ <b className="n">{Math.round(totalKg/totalCap*100)}%</b> ·
            พื้นที่ว่าง <b className="n">{empty}</b> โซน
          </div>
        </div>
        <div className="page-actions">
          <div className="seg">
            {['WH-A','WH-B','WH-C','WH-D'].map(w => (
              <button key={w} className={warehouse === w ? 'active' : ''} onClick={() => setWarehouse(w)}>{w}</button>
            ))}
          </div>
          <button className="btn"><Icon name="plus" size={14}/>เพิ่มโซน</button>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <KPI label="สต็อกรวมในคลัง" icon="box" value={(totalKg/1000).toFixed(1)} unit="ตัน" delta={3.4} accent=""/>
        <KPI label="ความจุที่ใช้" icon="warehouse" value={Math.round(totalKg/totalCap*100)} unit="%" delta={5.2} accent="orange"/>
        <KPI label="โซนใช้งาน" icon="map" value={zones.filter(z=>z.type!=='empty').length} unit={`/ ${zones.length}`} accent="blue"/>
        <KPI label="แจ้งเตือน" icon="bell" value={3} delta={1} deltaDir="up" accent="red"/>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="col" style={{ gap: 16 }}>
          <Section title={`แผนผัง ${warehouse} · กรุงเทพมหานคร`} action={
            <div className="row" style={{ gap: 12, fontSize: 11.5 }}>
              <span className="row" style={{gap:4}}><span style={{width:10,height:10,background:'var(--bad-soft)',borderRadius:2}}/>เต็ม</span>
              <span className="row" style={{gap:4}}><span style={{width:10,height:10,background:'var(--warn-soft)',borderRadius:2}}/>อุณหภูมิห้อง</span>
              <span className="row" style={{gap:4}}><span style={{width:10,height:10,background:'var(--info-soft)',borderRadius:2}}/>ห้องเย็น</span>
              <span className="row" style={{gap:4}}><span style={{width:10,height:10,background:'repeating-linear-gradient(45deg, transparent 0 3px, var(--border) 3px 4px)',borderRadius:2}}/>ว่าง</span>
            </div>
          }>
            <div className="zone-map">
              {zones.map(z => {
                const f = z.fruit ? D.fruitById[z.fruit] : null;
                const pct = z.cap > 0 ? Math.round(z.kg / z.cap * 100) : 0;
                return (
                  <div key={z.id} className={`zone ${z.type} ${selectedZone === z.id ? 'selected' : ''}`} onClick={() => setSelectedZone(z.id)}>
                    <span className="z-temp"><Icon name="thermo" size={10} style={{verticalAlign:'middle'}}/>{z.temp}°</span>
                    <div className="z-id">{z.id}</div>
                    <div>
                      {f ? <>
                        <div className="row" style={{ gap: 6, alignItems:'center' }}>
                          <span style={{ width: 10, height: 10, background: f.color, borderRadius: 2 }}/>
                          <div className="z-fruit" style={{ fontSize: 12 }}>{f.name.length > 10 ? f.name.substring(0,9)+'…' : f.name}</div>
                        </div>
                        <div className="z-fill">{(z.kg/1000).toFixed(1)}t · {pct}%</div>
                      </> : <div className="z-fruit muted tiny">ว่าง · {(z.cap/1000).toFixed(1)}t</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="การเคลื่อนไหวสต็อก (วันนี้)">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>เวลา</th><th>ประเภท</th><th>ผลไม้</th><th>โซน</th><th className="num">น้ำหนัก</th><th>ผู้ทำรายการ</th></tr>
                </thead>
                <tbody>
                  {[
                    { time: '14:32', type: 'in',  fruit: 'F02', zone: 'B-04', kg: 1240, by: 'นายธนากร' },
                    { time: '13:48', type: 'in',  fruit: 'F05', zone: 'A-02', kg: 680,  by: 'นายธนากร' },
                    { time: '12:15', type: 'out', fruit: 'F01', zone: 'A-01', kg: 320,  by: 'คุณวิภา' },
                    { time: '11:50', type: 'in',  fruit: 'F03', zone: 'C-03', kg: 2100, by: 'นายธนากร' },
                    { time: '10:22', type: 'adj', fruit: 'F02', zone: 'B-05', kg: -42,  by: 'คุณวิภา' },
                  ].map((m, i) => (
                    <tr key={i}>
                      <td className="n">{m.time}</td>
                      <td>
                        {m.type === 'in' && <Pill kind="good"><Icon name="arrow" size={10}/>เข้า</Pill>}
                        {m.type === 'out' && <Pill kind="bad"><Icon name="arrow" size={10} style={{transform:'rotate(180deg)'}}/>ออก</Pill>}
                        {m.type === 'adj' && <Pill kind="warn">ปรับยอด</Pill>}
                      </td>
                      <td><FruitChip fruit={D.fruitById[m.fruit]}/></td>
                      <td className="mono">{m.zone}</td>
                      <td className="num bold" style={{ color: m.kg > 0 ? 'var(--good)' : 'var(--bad)' }}>{m.kg > 0 ? '+' : ''}{kg(m.kg)}</td>
                      <td className="tiny muted">{m.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* Zone detail */}
        <div className="col" style={{ gap: 16 }}>
          <ZoneDetail zone={zone} />

          <Section title="เซ็นเซอร์ห้องเย็น" action={<Pill kind="good"><span className="dot"/>ออนไลน์</Pill>}>
            <div className="card-body col" style={{ gap: 14 }}>
              {[
                { name: 'ห้อง A · ผลไม้สด',  current: 12.4, target: 12, ok: true },
                { name: 'ห้อง B · ทุเรียน',  current: 16.1, target: 16, ok: true },
                { name: 'ห้อง C · ลำไย',     current: 15.2, target: 13, ok: false },
                { name: 'ห้อง D · พิเศษ',    current: 8.0,  target: 8,  ok: true },
              ].map(r => (
                <div key={r.name} className="row" style={{ gap: 12 }}>
                  <Icon name="thermo" size={18} style={{ color: r.ok ? 'var(--info)' : 'var(--bad)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</div>
                    <div className="muted tiny">เป้าหมาย {r.target}°C</div>
                  </div>
                  <div className="n bold" style={{ fontSize: 17, color: r.ok ? 'var(--ink)' : 'var(--bad)' }}>
                    {r.current}°<span className="tiny muted">C</span>
                  </div>
                  {!r.ok && <Icon name="bell" size={16} style={{ color: 'var(--bad)' }}/>}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

const ZoneDetail = ({ zone }) => {
  const D = window.DATA;
  const f = zone.fruit ? D.fruitById[zone.fruit] : null;
  const pct = zone.cap > 0 ? Math.round(zone.kg / zone.cap * 100) : 0;
  const barColor = pct > 90 ? 'bad' : pct > 75 ? 'warn' : '';

  return (
    <Section title={`รายละเอียดโซน ${zone.id}`} action={<button className="btn btn-ghost btn-sm"><Icon name="edit" size={12}/>ปรับสต็อก</button>}>
      <div className="card-body">
        {f ? (
          <>
            <div className="row" style={{ gap: 12, marginBottom: 14 }}>
              <FruitDot fruit={f} size={48} />
              <div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{f.name}</div>
                <div className="muted tiny">{f.en} · เกรด A</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="row" style={{ justifyContent:'space-between', marginBottom: 6, fontSize: 12.5 }}>
                <span className="muted">ความจุที่ใช้</span>
                <span className="n bold">{kg(zone.kg)} / {kg(zone.cap)}</span>
              </div>
              <div className="bar-bg" style={{ height: 10 }}>
                <div className={`bar-fg ${barColor}`} style={{ width: pct + '%' }}/>
              </div>
              <div className="row" style={{ justifyContent:'space-between', marginTop: 4 }}>
                <span className="tiny muted">{kg(zone.cap - zone.kg)} ว่าง</span>
                <span className="tiny bold n">{pct}%</span>
              </div>
            </div>
            <div className="grid-3" style={{ gap: 8 }}>
              <Mini label="อุณหภูมิ" value={zone.temp + '°C'} icon="thermo"/>
              <Mini label="ประเภทโซน" value={zone.type === 'cool' ? 'ห้องเย็น' : zone.type === 'warm' ? 'อุณหภูมิห้อง' : zone.type === 'full' ? 'ใกล้เต็ม' : '-'} icon="warehouse"/>
              <Mini label="ใกล้หมดอายุ" value="3 รายการ" icon="bell" valueClass={'bad'}/>
            </div>
            <div className="hr"/>
            <div style={{ fontSize: 12, color:'var(--muted)', fontWeight: 500, letterSpacing:'.04em', textTransform: 'uppercase', marginBottom: 8 }}>ล็อตในโซน</div>
            <div className="col" style={{ gap: 6 }}>
              {[
                { id: 'LOT-2026-0184', kg: 1240, in: '15/05/2026', exp: '22/05/2026', days: 7 },
                { id: 'LOT-2026-0175', kg: 1480, in: '13/05/2026', exp: '20/05/2026', days: 5 },
                { id: 'LOT-2026-0168', kg: 2180, in: '11/05/2026', exp: '18/05/2026', days: 3 },
              ].map(l => (
                <div key={l.id} className="row" style={{ gap: 10, padding: 8, background:'var(--surface-2)', borderRadius: 6 }}>
                  <span className="mono tiny">{l.id}</span>
                  <span className="n bold">{kg(l.kg)}</span>
                  <span style={{ marginLeft:'auto' }} className={`pill ${l.days <= 3 ? 'bad' : l.days <= 5 ? 'warn' : 'good'}`}>
                    หมดอายุใน {l.days} วัน
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Icon name="box" size={32}/>
            <div>โซนว่าง · ความจุ {kg(zone.cap)}</div>
            <button className="btn btn-sm btn-primary" style={{ marginTop: 10 }}><Icon name="plus" size={12}/>นำเข้าสต็อก</button>
          </div>
        )}
      </div>
    </Section>
  );
};

window.Warehouse = Warehouse;
