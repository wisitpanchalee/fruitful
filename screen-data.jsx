// Inventory tracking + Accounting + Reports

const Inventory = ({ goto, showToast }) => {
  const D = window.DATA;
  const [tab, setTab] = React.useState('all');
  const [scanOpen, setScanOpen] = React.useState(false);

  const stockByFruit = D.fruits.map(f => {
    const zones = D.zones.filter(z => z.fruit === f.id);
    const total = zones.reduce((s,z)=>s+z.kg,0);
    return { ...f, total, zones: zones.length, lots: zones.length };
  }).filter(f => f.total > 0).sort((a,b) => b.total - a.total);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">การติดตามสต็อก</h1>
          <div className="page-sub">ตรวจสอบสต็อกตามผลไม้ · ล็อต · บาร์โค้ด</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={() => setScanOpen(true)}><Icon name="qr" size={14}/>สแกนบาร์โค้ด</button>
          <button className="btn"><Icon name="download" size={14}/>ส่งออก</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/>ปรับสต็อก</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPI label="สต็อกรวม" icon="box" value={(stockByFruit.reduce((s,f)=>s+f.total,0)/1000).toFixed(1)} unit="ตัน" delta={3.4}/>
        <KPI label="ชนิดผลไม้" icon="leaf" value={stockByFruit.length} unit="ชนิด" accent="orange"/>
        <KPI label="ของเสีย/เสื่อม" icon="trash" value="142" unit="กก." delta={-12.4} deltaDir="down" accent="red"/>
        <KPI label="ใกล้หมดอายุ" icon="bell" value="2,180" unit="กก." accent="blue"/>
      </div>

      <div className="tabs" style={{ marginBottom: 0 }}>
        {[
          { id: 'all', label: 'สต็อกตามผลไม้' },
          { id: 'lots', label: 'ล็อต' },
          { id: 'spoil', label: 'ของเสีย' },
          { id: 'audit', label: 'บันทึกการตรวจ' },
        ].map(t => <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {tab === 'all' && (
        <div className="card" style={{ overflow:'hidden', marginTop: -1 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ผลไม้</th>
                <th>เกรด</th>
                <th>โซน</th>
                <th>ล็อต</th>
                <th className="num">สต็อก</th>
                <th className="num">มูลค่า</th>
                <th>หมุนเวียน</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {stockByFruit.map(f => {
                const value = f.total * (45 + (parseInt(f.id.slice(1)) * 7));
                const turn = 65 + (parseInt(f.id.slice(1)) * 3) % 30;
                return (
                  <tr key={f.id}>
                    <td><FruitChip fruit={f} sub={f.en}/></td>
                    <td className="row" style={{ gap: 3 }}><Grade g="A"/><span className="muted tiny">+B</span></td>
                    <td className="mono tiny">{f.zones} โซน</td>
                    <td className="n">{f.lots * 3}</td>
                    <td className="num bold">{kg(f.total)}</td>
                    <td className="num">{bahtShort(value)}</td>
                    <td>
                      <div className="row" style={{ gap: 8, minWidth: 110 }}>
                        <div style={{ flex: 1, height: 5, background:'var(--bg-deep)', borderRadius: 3, overflow:'hidden' }}>
                          <div style={{ width: turn + '%', height:'100%', background: f.color, borderRadius: 3 }}/>
                        </div>
                        <span className="tiny n muted">{turn}%</span>
                      </div>
                    </td>
                    <td>{turn > 80 ? <Pill kind="good">หมุนเวียนดี</Pill> : turn > 65 ? <Pill kind="warn">ปกติ</Pill> : <Pill kind="bad">ช้า</Pill>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'lots' && (
        <div className="card" style={{ overflow:'hidden', marginTop: -1 }}>
          <table className="table">
            <thead>
              <tr><th>เลขล็อต</th><th>ผลไม้</th><th>โซน</th><th className="num">น้ำหนัก</th><th>เข้าคลัง</th><th>หมดอายุ</th><th>สถานะ</th></tr>
            </thead>
            <tbody>
              {[
                ['LOT-2026-0184', 'F02', 'B-04', 1240, '15/05/2026', '22/05/2026', 7, 'good'],
                ['LOT-2026-0183', 'F05', 'A-02', 680,  '15/05/2026', '19/05/2026', 4, 'warn'],
                ['LOT-2026-0181', 'F03', 'C-03', 2100, '15/05/2026', '25/05/2026',10, 'good'],
                ['LOT-2026-0179', 'F03', 'C-04', 1820, '14/05/2026', '24/05/2026', 9, 'good'],
                ['LOT-2026-0176', 'F04', 'A-04', 280,  '14/05/2026', '17/05/2026', 2, 'bad'],
                ['LOT-2026-0175', 'F02', 'B-04', 1480, '13/05/2026', '20/05/2026', 5, 'warn'],
                ['LOT-2026-0168', 'F02', 'B-05', 2180, '11/05/2026', '18/05/2026', 3, 'bad'],
                ['LOT-2026-0162', 'F01', 'A-01', 4200, '10/05/2026', '17/05/2026', 2, 'bad'],
              ].map(([id, fid, zone, kgv, ind, exp, days, st]) => (
                <tr key={id}>
                  <td className="mono">{id}</td>
                  <td><FruitChip fruit={D.fruitById[fid]}/></td>
                  <td className="mono">{zone}</td>
                  <td className="num bold">{kg(kgv)}</td>
                  <td className="n tiny">{ind}</td>
                  <td className="n tiny">{exp}</td>
                  <td><Pill kind={st}>หมดอายุใน {days} วัน</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'spoil' && (
        <div className="grid-2-1" style={{ gap: 16, marginTop: 14 }}>
          <Section title="ของเสีย / เสื่อมสภาพ (7 วัน)">
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>วันที่</th><th>ผลไม้</th><th>ล็อต</th><th className="num">น้ำหนัก</th><th>สาเหตุ</th><th className="num">มูลค่า</th></tr></thead>
                <tbody>
                  {[
                    ['15/05/2026','F04','LOT-...0142', 42, 'เน่าเสีย', 3276],
                    ['14/05/2026','F03','LOT-...0138', 28, 'แมลงเจาะ', 728],
                    ['13/05/2026','F05','LOT-...0131', 36, 'หล่นเสียหาย', 1368],
                    ['12/05/2026','F02','LOT-...0125', 18, 'สุกเกินไป', 1620],
                    ['11/05/2026','F01','LOT-...0118', 18, 'เน่าเสีย', 810],
                  ].map((r,i) => (
                    <tr key={i}>
                      <td className="n tiny">{r[0]}</td>
                      <td><FruitChip fruit={D.fruitById[r[1]]}/></td>
                      <td className="mono tiny">{r[2]}</td>
                      <td className="num">{kg(r[3])}</td>
                      <td><Pill kind="bad">{r[4]}</Pill></td>
                      <td className="num bold" style={{color:'var(--bad)'}}>-{baht(r[5])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="แนวโน้มของเสีย">
            <div className="card-body">
              <Sparkline data={[180,210,160,142,198,168,142]} w={300} h={100} stroke="var(--bad)" fill="var(--bad-soft)"/>
              <div className="muted tiny" style={{ marginTop: 6 }}>ของเสียรายวัน 7 วันล่าสุด · ลดลง 12% จากสัปดาห์ก่อน</div>
              <div className="hr"/>
              <div className="col" style={{ gap: 8 }}>
                {[['เน่าเสีย', 48], ['สุกเกินไป', 28], ['หล่น/บาดเจ็บ', 16], ['แมลง', 8]].map(([k, v]) => (
                  <div key={k} className="row" style={{ gap: 10 }}>
                    <span style={{ width: 100, fontSize: 12.5 }}>{k}</span>
                    <div style={{ flex: 1, height: 8, background:'var(--bg-deep)', borderRadius: 4, overflow:'hidden' }}>
                      <div style={{ width: v + '%', height:'100%', background:'var(--bad)' }}/>
                    </div>
                    <span className="n tiny bold" style={{ width: 30, textAlign:'right' }}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {tab === 'audit' && (
        <div className="card" style={{ overflow: 'hidden', marginTop: -1 }}>
          <table className="table">
            <thead><tr><th>เวลา</th><th>ผู้ใช้</th><th>การกระทำ</th><th>รายการ</th><th>การเปลี่ยนแปลง</th></tr></thead>
            <tbody>
              {[
                ['15/05 14:32', 'นายธนากร', 'in',  'LOT-2026-0184', '+1,240 กก.'],
                ['15/05 13:48', 'นายธนากร', 'in',  'LOT-2026-0183', '+680 กก.'],
                ['15/05 12:15', 'คุณวิภา',  'out', 'LOT-2026-0162', '-320 กก. (ขายปลีก)'],
                ['15/05 11:50', 'นายธนากร', 'in',  'LOT-2026-0181', '+2,100 กก.'],
                ['15/05 10:22', 'คุณวิภา',  'adj', 'LOT-2026-0175', '-42 กก. (เน่าเสีย)'],
                ['15/05 09:14', 'AUTO',     'sys', 'ZONE B-04',     'แจ้งเตือนใกล้เต็ม 98%'],
                ['14/05 18:20', 'คุณสมหญิง','audit','คลัง WH-A',     'ตรวจนับสต็อก 142 รายการ'],
              ].map((r, i) => (
                <tr key={i}>
                  <td className="n tiny">{r[0]}</td>
                  <td>{r[2] === 'sys' ? <Pill>ระบบ</Pill> : r[1]}</td>
                  <td>
                    {r[2] === 'in' && <Pill kind="good">นำเข้า</Pill>}
                    {r[2] === 'out' && <Pill kind="bad">เบิกออก</Pill>}
                    {r[2] === 'adj' && <Pill kind="warn">ปรับยอด</Pill>}
                    {r[2] === 'sys' && <Pill kind="info">แจ้งเตือน</Pill>}
                    {r[2] === 'audit' && <Pill kind="accent">ตรวจสอบ</Pill>}
                  </td>
                  <td className="mono tiny">{r[3]}</td>
                  <td className="n">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={scanOpen} onClose={() => setScanOpen(false)} title="สแกนบาร์โค้ด / QR">
        <div style={{ textAlign:'center', padding: 20 }}>
          <div style={{ width: 240, height: 240, margin:'0 auto', background:'#000', borderRadius: 14, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset: 30, border:'2px solid #f0b65a', borderRadius: 10 }}/>
            <div style={{ position:'absolute', left: 30, right: 30, top: '50%', height: 2, background:'#f0b65a', boxShadow:'0 0 12px #f0b65a', animation:'scan 1.6s ease-in-out infinite alternate' }}/>
            <div style={{ position:'absolute', bottom: 8, left: 0, right: 0, textAlign:'center', color:'#fff', fontSize: 11 }}>วางบาร์โค้ดในกรอบ</div>
          </div>
          <style>{`@keyframes scan { from { top: 30% } to { top: 70% } }`}</style>
          <div className="muted tiny" style={{ marginTop: 14 }}>หรือใส่รหัสด้วยตัวเอง</div>
          <div className="row" style={{ gap: 8, marginTop: 8, maxWidth: 320, margin: '8px auto 0' }}>
            <input className="input" placeholder="LOT-2026-..." style={{ flex: 1 }}/>
            <button className="btn btn-primary" onClick={() => { setScanOpen(false); showToast('พบล็อต LOT-2026-0184'); }}>ค้นหา</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ----- Reports & Analytics -----
const Reports = ({ goto }) => {
  const D = window.DATA;
  const [range, setRange] = React.useState('30');
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">รายงาน & การวิเคราะห์</h1>
          <div className="page-sub">ข้อมูลเชิงลึกและการพยากรณ์ด้วย AI</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            <button className={range==='7'?'active':''} onClick={() => setRange('7')}>7 วัน</button>
            <button className={range==='30'?'active':''} onClick={() => setRange('30')}>30 วัน</button>
            <button className={range==='90'?'active':''} onClick={() => setRange('90')}>90 วัน</button>
          </div>
          <button className="btn"><Icon name="download" size={14}/>ส่งออก PDF</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPI label="รายได้" icon="coins" value="฿4.82M" delta={14.2} sparkData={[40,48,52,58,62,68,72,82]}/>
        <KPI label="ปริมาณรับซื้อ" icon="cart" value="142" unit="ตัน" delta={8.4} accent="orange" sparkData={[80,92,108,118,128,134,140,142]}/>
        <KPI label="กำไรขั้นต้น" icon="chart" value="22.4%" delta={1.2} accent="blue" sparkData={[18,19,20,21,21,22,22,22.4]}/>
        <KPI label="ผู้ขายที่ซื้อ" icon="users" value="8" delta={0} accent="" sparkData={[6,6,7,7,8,8,8,8]}/>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="col" style={{ gap: 16 }}>
          <Section title="พยากรณ์ราคา 14 วัน (AI)" action={<Pill kind="info"><Icon name="sparkle" size={10}/>AI-Powered</Pill>}>
            <div className="card-body">
              <PriceForecast/>
              <div className="row" style={{ gap: 14, marginTop: 12, justifyContent:'center', fontSize: 11.5 }}>
                <span className="row" style={{gap:6}}><span style={{width:14,height:2,background:'var(--ink)'}}/>ราคาจริง</span>
                <span className="row" style={{gap:6}}><span style={{width:14,height:2,background:'var(--accent)',borderTop:'2px dashed'}}/>คาดการณ์</span>
                <span className="row" style={{gap:6}}><span style={{width:14,height:8,background:'var(--accent-soft)'}}/>ช่วงความเชื่อมั่น</span>
              </div>
            </div>
          </Section>

          <Section title="อันดับผู้ขาย (ตามมูลค่า)" action={<button className="btn btn-ghost btn-sm" onClick={() => goto('suppliers')}>ดูทั้งหมด</button>}>
            <div className="card-body col" style={{ gap: 8 }}>
              {[...D.suppliers].sort((a,b)=>b.total-a.total).slice(0,5).map((s, i) => {
                const max = D.suppliers[0].total;
                const pct = s.total / max * 100;
                return (
                  <div key={s.id} className="row" style={{ gap: 10 }}>
                    <div style={{ width: 22, textAlign:'right', fontFamily:'var(--font-num)', fontWeight: 700, color: i < 3 ? 'var(--accent)' : 'var(--muted)' }}>
                      {i < 3 ? <Icon name="star" size={14} style={{ color: 'var(--accent)' }}/> : ''}{i+1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ justifyContent:'space-between' }}>
                        <span style={{ fontWeight: 500, fontSize: 13.5 }}>{s.name}</span>
                        <span className="n bold">{bahtShort(s.total)}</span>
                      </div>
                      <div className="row" style={{ gap: 10, marginTop: 2 }}>
                        <div style={{ flex: 1, height: 5, background:'var(--bg-deep)', borderRadius: 3 }}>
                          <div style={{ width: pct + '%', height: '100%', background:'var(--primary)', borderRadius: 3 }}/>
                        </div>
                        <span className="tiny muted">{s.orders} ครั้ง</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <Section title="สัดส่วนผลไม้ที่รับซื้อ">
            <div className="card-body" style={{ display:'flex', gap: 18, alignItems:'center' }}>
              <DonutChart data={D.topFruits.map((t,i) => ({ label: D.fruitById[t.fid].name, value: t.kg, color: D.fruitById[t.fid].color }))}/>
              <div className="col" style={{ gap: 6, flex: 1 }}>
                {D.topFruits.map(t => {
                  const f = D.fruitById[t.fid];
                  const total = D.topFruits.reduce((s,x)=>s+x.kg,0);
                  return (
                    <div key={t.fid} className="row" style={{ gap: 8, fontSize: 12.5 }}>
                      <span style={{ width: 10, height: 10, background: f.color, borderRadius: 2 }}/>
                      <span style={{ flex: 1 }}>{f.name}</span>
                      <span className="n bold">{Math.round(t.kg/total*100)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          <Section title="ผลกระทบจากสภาพอากาศ" action={<Icon name="cloud" size={16} className="muted"/>}>
            <div className="card-body col" style={{ gap: 10 }}>
              {[
                { region: 'จันทบุรี', risk: 'high',   note: 'ฝนตกหนัก 16-17 พ.ค.', impact: '-12% ผลผลิตทุเรียน' },
                { region: 'ระยอง',    risk: 'medium', note: 'อากาศแปรปรวน',         impact: '-5% เงาะ' },
                { region: 'นครปฐม',  risk: 'low',    note: 'ปกติ',                   impact: 'ไม่มีผลกระทบ' },
                { region: 'เชียงใหม่', risk: 'low',   note: 'ปกติ',                   impact: 'ไม่มีผลกระทบ' },
              ].map(w => (
                <div key={w.region} className="row" style={{ gap: 10, padding: 10, background:'var(--surface-2)', borderRadius: 8 }}>
                  <Icon name="cloud" size={18} style={{ color: w.risk === 'high' ? 'var(--bad)' : w.risk === 'medium' ? 'var(--warn)' : 'var(--info)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{w.region}</div>
                    <div className="muted tiny">{w.note}</div>
                  </div>
                  <div className="tiny" style={{ textAlign:'right' }}>
                    <Pill kind={w.risk === 'high' ? 'bad' : w.risk === 'medium' ? 'warn' : 'good'}>{w.risk === 'high' ? 'เสี่ยงสูง' : w.risk === 'medium' ? 'ปานกลาง' : 'ต่ำ'}</Pill>
                    <div className="muted" style={{ marginTop: 2 }}>{w.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="คาดการณ์ความต้องการสัปดาห์หน้า" action={<Pill kind="info"><Icon name="sparkle" size={10}/>AI</Pill>}>
            <div className="card-body col" style={{ gap: 10 }}>
              {D.topFruits.slice(0,4).map(t => {
                const f = D.fruitById[t.fid];
                const demand = 80 + (parseInt(t.fid.slice(1))*13) % 40;
                return (
                  <div key={t.fid} className="row" style={{ gap: 10 }}>
                    <FruitDot fruit={f} size={22}/>
                    <span style={{ flex: 1, fontSize: 13 }}>{f.name}</span>
                    <div style={{ width: 80, height: 6, background:'var(--bg-deep)', borderRadius: 3, overflow:'hidden' }}>
                      <div style={{ width: demand + '%', height:'100%', background: 'var(--primary)' }}/>
                    </div>
                    <span className="n tiny bold" style={{ width: 60, textAlign:'right' }}>{demand} ตัน</span>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

const PriceForecast = () => {
  const actual = [82, 84, 88, 90, 92, 95, 94, 92];
  const forecast = [92, 91, 90, 89, 88, 87, 88];
  const W = 460, H = 200, P = { l: 36, r: 12, t: 14, b: 22 };
  const all = [...actual, ...forecast];
  const max = Math.max(...all) * 1.06, min = Math.min(...all) * 0.94;
  const range = max - min;
  const allPts = [...actual, ...forecast];
  const stepX = (W - P.l - P.r) / (allPts.length - 1);
  const y = v => P.t + (1 - (v - min) / range) * (H - P.t - P.b);
  const aPath = actual.map((v, i) => (i===0?'M':'L') + (P.l + i*stepX) + ',' + y(v)).join(' ');
  const fStart = actual.length - 1;
  const fPath = forecast.map((v, i) => (i===0?'M':'L') + (P.l + (fStart + i)*stepX) + ',' + y(v)).join(' ');
  // confidence band
  const band = forecast.map((v, i) => [P.l + (fStart + i)*stepX, y(v - 3), y(v + 3)]);
  const bandPath = band.map((p,i) => (i===0?'M':'L') + p[0] + ',' + p[1]).concat(band.slice().reverse().map(p => 'L' + p[0] + ',' + p[2])).join(' ') + ' Z';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height: 200, display:'block' }}>
      {[0,0.25,0.5,0.75,1].map(g => <line key={g} x1={P.l} x2={W-P.r} y1={P.t+g*(H-P.t-P.b)} y2={P.t+g*(H-P.t-P.b)} stroke="var(--border-soft)"/>)}
      <path d={bandPath} fill="var(--accent-soft)" opacity=".7"/>
      <path d={aPath} fill="none" stroke="var(--ink)" strokeWidth="2"/>
      <path d={fPath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4"/>
      {actual.map((v,i) => <circle key={'a'+i} cx={P.l + i*stepX} cy={y(v)} r="3" fill="var(--ink)"/>)}
      {forecast.map((v,i) => <circle key={'f'+i} cx={P.l + (fStart+i)*stepX} cy={y(v)} r="3" fill="var(--accent)"/>)}
      {/* y axis labels */}
      {[min, (min+max)/2, max].map((v, i) => (
        <text key={i} x="4" y={y(v)+3} fill="var(--muted)" fontSize="10" fontFamily="var(--font-num)">{Math.round(v)}฿</text>
      ))}
      {/* divider between actual/forecast */}
      <line x1={P.l + fStart*stepX} x2={P.l + fStart*stepX} y1={P.t} y2={H-P.b} stroke="var(--border)" strokeDasharray="2 2"/>
      <text x={P.l + fStart*stepX + 4} y={P.t + 10} fill="var(--accent)" fontSize="10">← วันนี้ · พยากรณ์ →</text>
    </svg>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((s,d) => s + d.value, 0);
  const r = 60, R = 84;
  let acc = 0;
  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      {data.map((d, i) => {
        const start = acc / total * Math.PI * 2 - Math.PI/2;
        acc += d.value;
        const end = acc / total * Math.PI * 2 - Math.PI/2;
        const large = (end - start) > Math.PI ? 1 : 0;
        const x1 = 90 + Math.cos(start)*R, y1 = 90 + Math.sin(start)*R;
        const x2 = 90 + Math.cos(end)*R,   y2 = 90 + Math.sin(end)*R;
        const x3 = 90 + Math.cos(end)*r,   y3 = 90 + Math.sin(end)*r;
        const x4 = 90 + Math.cos(start)*r, y4 = 90 + Math.sin(start)*r;
        return <path key={i} d={`M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`} fill={d.color} stroke="var(--surface)" strokeWidth="2"/>;
      })}
      <text x="90" y="85" textAnchor="middle" fill="var(--muted)" fontSize="11">รวม</text>
      <text x="90" y="105" textAnchor="middle" fill="var(--ink)" fontSize="20" fontWeight="600" fontFamily="var(--font-num)">{(total/1000).toFixed(0)}t</text>
    </svg>
  );
};

// ----- Accounting -----
const Accounting = ({ goto }) => {
  const D = window.DATA;
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">บัญชี & การเงิน</h1>
          <div className="page-sub">รายงานทางการเงินและงบกำไรขาดทุน</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14}/>ส่งออก Excel</button>
          <button className="btn"><Icon name="print" size={14}/>พิมพ์รายงาน</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/>ออกใบกำกับภาษี</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPI label="ค่าซื้อสินค้า (เดือนนี้)" icon="coins" value="฿3.74M" delta={14.2} accent="orange"/>
        <KPI label="รายได้รวม" icon="chart" value="฿4.82M" delta={12.8}/>
        <KPI label="กำไรขั้นต้น" icon="sparkle" value="฿1.08M" delta={8.4} accent="blue"/>
        <KPI label="ภาษีค้างจ่าย" icon="book" value="฿261k" delta={6.2} deltaDir="up" accent="red"/>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <Section title="งบกำไรขาดทุนเบื้องต้น (พ.ค. 2569)" action={<Pill kind="info">ฉบับร่าง</Pill>}>
          <div className="table-wrap">
            <table className="table">
              <tbody>
                {[
                  ['รายได้จากการขาย', 4823400, 'good', false],
                  ['  · ผลไม้สด',     3984200, '', true],
                  ['  · ผลไม้แปรรูป',   582100, '', true],
                  ['  · บริการขนส่ง',    257100, '', true],
                  ['ค่าซื้อผลไม้ (COGS)', -3742800, 'bad', false],
                  ['ค่าขนส่ง',           -182400, 'bad', false],
                  ['ค่าจัดเก็บ/ห้องเย็น',-126200, 'bad', false],
                  ['ค่าบริหาร',          -284100, 'bad', false],
                  ['กำไรก่อนภาษี',       487900, 'good', false],
                  ['ภาษีเงินได้ 20%',     -97580, 'bad', false],
                  ['กำไรสุทธิ',          390320, 'total', false],
                ].map((r, i) => (
                  <tr key={i} style={r[2] === 'total' ? { background: 'var(--primary-soft)' } : {}}>
                    <td style={{ paddingLeft: r[3] ? 32 : 14, fontWeight: r[2] === 'total' ? 600 : (r[3] ? 400 : 500), color: r[3] ? 'var(--muted)' : 'inherit', fontSize: r[2] === 'total' ? 14 : 13 }}>{r[0]}</td>
                    <td className="num bold" style={{ color: r[2] === 'total' ? 'var(--primary)' : r[2] === 'bad' ? 'var(--bad)' : r[2] === 'good' ? 'var(--good)' : 'inherit', fontSize: r[2] === 'total' ? 16 : 13 }}>
                      {r[1] < 0 ? '(' + baht(-r[1]) + ')' : baht(r[1])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <div className="col" style={{ gap: 16 }}>
          <Section title="ใบกำกับภาษีล่าสุด">
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>เลขที่</th><th>ผู้ขาย</th><th className="num">ก่อนภาษี</th><th className="num">VAT</th><th>สถานะ</th></tr></thead>
                <tbody>
                  {D.transactions.slice(0,6).map(t => {
                    const s = D.suppById[t.supplier];
                    return (
                      <tr key={t.id}>
                        <td className="mono tiny">TX-{t.id.slice(-5)}</td>
                        <td className="tiny">{s.name}</td>
                        <td className="num">{baht(t.total)}</td>
                        <td className="num">{baht(Math.round(t.total * 0.07))}</td>
                        <td><StatusPill status={t.pay}/></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="รายจ่ายตามประเภท" sub="พฤษภาคม 2569">
            <div className="card-body col" style={{ gap: 8 }}>
              {[
                ['ค่าซื้อผลไม้', 3742800, 'var(--primary)'],
                ['ค่าขนส่ง',     182400,  'var(--accent)'],
                ['ค่าจัดเก็บ',   126200,  'var(--info)'],
                ['ค่าบริหาร',    284100,  'var(--warn)'],
              ].map(([k, v, c], i) => {
                const total = 4335500;
                const pct = v / total * 100;
                return (
                  <div key={k}>
                    <div className="row" style={{ justifyContent:'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{k}</span>
                      <span className="n bold">{bahtShort(v)} <span className="muted tiny">({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div style={{ height: 8, background:'var(--bg-deep)', borderRadius: 4, overflow:'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: c, borderRadius: 4 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

window.Inventory = Inventory;
window.Reports = Reports;
window.Accounting = Accounting;
