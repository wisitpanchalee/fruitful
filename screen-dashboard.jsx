// Dashboard screen

const Dashboard = ({ goto }) => {
  const D = window.DATA;
  const trendKg = D.trend.map(t => t.v);
  const trendPay = D.trend.map(t => t.p);

  const todayKg = D.transactions.filter(t => t.date === '15/05/2026').reduce((s, t) => s + t.kg, 0);
  const todayValue = D.transactions.filter(t => t.date === '15/05/2026').reduce((s, t) => s + t.total, 0);
  const totalStock = D.zones.reduce((s, z) => s + z.kg, 0);
  const totalCap = D.zones.reduce((s, z) => s + z.cap, 0);
  const pendingPay = D.payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">สวัสดีครับ คุณธนากร 👋</h1>
          <div className="page-sub">วันนี้ <span className="n">15 พ.ค. 2569</span> · มีกิจกรรม <b>14 รายการ</b> · รถบรรทุก <b>3 คัน</b> กำลังมาส่ง</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14}/>ส่งออก</button>
          <button className="btn btn-primary" onClick={() => goto('purchasing')}>
            <Icon name="plus" size={14}/>สร้างใบรับซื้อใหม่
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid">
        <KPI label="ซื้อวันนี้" icon="cart" value={kg(todayKg)} delta={12.4} deltaDir="up" sparkData={trendKg} accent="" />
        <KPI label="มูลค่าซื้อวันนี้" icon="coins" value={bahtShort(todayValue)} delta={8.2} deltaDir="up" sparkData={trendPay} accent="orange" />
        <KPI label="สต็อกรวม" icon="box" value={(totalStock/1000).toFixed(1)} unit={`ตัน · ${Math.round(totalStock/totalCap*100)}%`} delta={3.4} deltaDir="up" sparkData={[42,48,52,58,55,62,68,72,68,75,82,78,84,86]} accent="blue" />
        <KPI label="ค้างชำระ" icon="payment" value={bahtShort(pendingPay)} delta={2.8} deltaDir="down" sparkData={[180,210,205,240,230,220,260,255,270,265,255,240,235,245]} accent="red" />
      </div>

      {/* Main grid */}
      <div className="grid-2">
        <div className="col" style={{ gap: 16 }}>
          {/* Purchase trend chart */}
          <Section
            title="แนวโน้มการซื้อ 14 วันล่าสุด"
            sub="น้ำหนัก (ตัน) · มูลค่า (พันบาท)"
            action={
              <div className="seg">
                <button>7 วัน</button>
                <button className="active">14 วัน</button>
                <button>30 วัน</button>
              </div>
            }
          >
            <div className="card-body">
              <PurchaseTrendChart data={D.trend} />
            </div>
          </Section>

          {/* Recent transactions */}
          <Section
            title="รายการรับซื้อล่าสุด"
            action={<button className="btn btn-ghost btn-sm" onClick={() => goto('inventory')}>ดูทั้งหมด <Icon name="arrow" size={12}/></button>}
          >
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>เลขที่</th>
                    <th>ผลไม้</th>
                    <th>ผู้ขาย</th>
                    <th className="num">น้ำหนัก</th>
                    <th className="num">มูลค่า</th>
                    <th>เกรด</th>
                    <th>การชำระ</th>
                  </tr>
                </thead>
                <tbody>
                  {D.transactions.slice(0, 6).map(t => {
                    const f = D.fruitById[t.fruit];
                    const s = D.suppById[t.supplier];
                    return (
                      <tr key={t.id} style={{ cursor: 'pointer' }}>
                        <td className="row-id">{t.id}</td>
                        <td><FruitChip fruit={f} /></td>
                        <td>
                          <div style={{fontSize:13}}>{s.name}</div>
                          <div className="muted tiny">{s.province}</div>
                        </td>
                        <td className="num">{kg(t.kg)}</td>
                        <td className="num bold">{baht(t.total)}</td>
                        <td><Grade g={t.grade} /></td>
                        <td><StatusPill status={t.pay}/></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Top selling */}
          <Section title="ผลไม้ขายดี (เดือนนี้)" action={<button className="btn btn-ghost btn-sm" onClick={() => goto('reports')}>รายงาน <Icon name="arrow" size={12}/></button>}>
            <div className="card-body" style={{ display:'grid', gap: 10 }}>
              {D.topFruits.map((t, i) => {
                const f = D.fruitById[t.fid];
                const max = D.topFruits[0].kg;
                const pct = (t.kg / max) * 100;
                return (
                  <div key={t.fid} className="row" style={{ gap: 14 }}>
                    <div style={{ width: 22, color: 'var(--muted)', fontFamily:'var(--font-num)', fontWeight: 600, textAlign:'right' }}>{i+1}</div>
                    <FruitDot fruit={f} size={28} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ justifyContent:'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 500, fontSize: 13.5 }}>{f.name}</span>
                        <span className="n tiny muted">{(t.kg/1000).toFixed(1)} ตัน</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-deep)', borderRadius: 3, overflow:'hidden' }}>
                        <div style={{ width: pct + '%', height: '100%', background: f.color, borderRadius: 3, transition: 'width .5s' }} />
                      </div>
                    </div>
                    <div style={{ minWidth: 110, textAlign:'right' }}>
                      <div className="n bold">{bahtShort(t.rev)}</div>
                      <span className={`delta ${t.change >= 0 ? 'up' : 'down'}`} style={{ fontSize: 11 }}>
                        {t.change >= 0 ? '↑' : '↓'} {Math.abs(t.change)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="col" style={{ gap: 16 }}>
          {/* AI prediction */}
          <div className="card" style={{ overflow: 'hidden', position:'relative' }}>
            <div style={{ position:'absolute', inset: 0, background: 'linear-gradient(135deg, var(--primary-soft) 0%, transparent 60%)', pointerEvents:'none' }}/>
            <div className="card-body" style={{ position: 'relative' }}>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <span style={{ background:'var(--primary)', color:'#fff', width: 28, height: 28, borderRadius: 8, display:'grid', placeItems:'center' }}>
                  <Icon name="sparkle" size={15} />
                </span>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, letterSpacing: '.08em' }}>AI INSIGHT</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>คาดการณ์ราคาทุเรียน</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.55 }}>
                ราคามีแนวโน้ม<b style={{ color: 'var(--bad)' }}>ลดลง 4.2%</b> ใน 7 วันข้างหน้า เนื่องจากผลผลิตเข้าสู่ตลาดเพิ่มขึ้นจากภาคใต้ แนะนำให้ชะลอการรับซื้อหากเป็นไปได้
              </div>
              <div className="row" style={{ gap: 16, marginTop: 14, fontSize: 12 }}>
                <div>
                  <div className="muted tiny">ราคาเฉลี่ยปัจจุบัน</div>
                  <div className="n bold" style={{ fontSize: 18 }}>฿92<span className="muted tiny n">/กก.</span></div>
                </div>
                <div>
                  <div className="muted tiny">คาดการณ์ 7 วัน</div>
                  <div className="n bold" style={{ fontSize: 18, color: 'var(--bad)' }}>฿88<span className="muted tiny n">/กก.</span></div>
                </div>
                <div style={{ marginLeft:'auto' }}>
                  <Sparkline data={[92,93,94,92,91,89,88]} stroke="var(--bad)" fill="var(--bad-soft)" w={80} h={36} />
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <Section title="แจ้งเตือนสำคัญ" action={<Pill kind="bad"><span className="dot"/>4 รายการ</Pill>}>
            <div style={{ padding: 14, display:'grid', gap: 10 }}>
              <div className="alert bad">
                <Icon name="bell" size={16} />
                <div style={{ flex: 1 }}>
                  <b>โซน B-04 ใกล้เต็ม (98%)</b>
                  <div className="tiny">ทุเรียน · 4,900 / 5,000 กก.</div>
                </div>
              </div>
              <div className="alert">
                <Icon name="thermo" size={16} />
                <div style={{ flex: 1 }}>
                  <b>อุณหภูมิห้องเย็น C-02 สูงผิดปกติ</b>
                  <div className="tiny">15.2°C · ตั้งไว้ 13°C</div>
                </div>
              </div>
              <div className="alert info">
                <Icon name="truck" size={16} />
                <div style={{ flex: 1 }}>
                  <b>รถบรรทุก BMK-3411 จะถึงในอีก 25 นาที</b>
                  <div className="tiny">มะม่วงน้ำดอกไม้ 1,200 กก. จาก ฟาร์มลุงสมชาย</div>
                </div>
              </div>
              <div className="alert info">
                <Icon name="cloud" size={16} />
                <div style={{ flex: 1 }}>
                  <b>พยากรณ์ฝนตกหนัก จันทบุรี 16-17 พ.ค.</b>
                  <div className="tiny">อาจกระทบการขนส่ง 6 รายการ</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Warehouse capacity */}
          <Section title="ความจุคลังสินค้า" action={<button className="btn btn-ghost btn-sm" onClick={() => goto('warehouse')}>ดูแผนผัง <Icon name="arrow" size={12}/></button>}>
            <div className="card-body">
              {[
                { name: 'WH-A · กรุงเทพ',   pct: 78, k: 'warn'},
                { name: 'WH-B · ราชบุรี',  pct: 62, k: ''},
                { name: 'WH-C · เชียงใหม่', pct: 92, k: 'bad'},
                { name: 'WH-D · ห้องเย็น',  pct: 34, k: ''},
              ].map(w => (
                <div key={w.name} className="cap-row">
                  <span className="name">{w.name}</span>
                  <div className="bar-bg"><div className={`bar-fg ${w.k}`} style={{ width: w.pct + '%' }}/></div>
                  <span className="pct">{w.pct}%</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Activity */}
          <Section title="กิจกรรมล่าสุด" action={<button className="btn btn-ghost btn-sm">ทั้งหมด <Icon name="arrow" size={12}/></button>}>
            <div>
              {D.activity.slice(0, 6).map((a, i) => {
                const dotClass = { warn:'orange', pay:'orange', truck:'blue', ai:'red', order:'' }[a.type] || '';
                const iconN   = { warn:'bell', pay:'coins', truck:'truck', ai:'sparkle', order:'cart' }[a.type] || 'check';
                return (
                  <div key={i} className="feed-item">
                    <div className={`feed-dot ${dotClass}`}><Icon name={iconN} size={14}/></div>
                    <div className="feed-body">
                      <div><span className="who">{a.who}</span> <span className="what">{a.what}</span></div>
                    </div>
                    <span className="feed-time">{a.t}</span>
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

// Bar chart for purchase trend
const PurchaseTrendChart = ({ data }) => {
  const W = 720, H = 200, P = { l: 36, r: 16, t: 14, b: 28 };
  const maxV = Math.max(...data.map(d => d.v)) * 1.15;
  const maxP = Math.max(...data.map(d => d.p)) * 1.15;
  const barW = (W - P.l - P.r) / data.length * 0.55;
  const stepX = (W - P.l - P.r) / data.length;
  const linePts = data.map((d, i) => {
    const x = P.l + i * stepX + stepX/2;
    const y = P.t + (1 - d.p / maxP) * (H - P.t - P.b);
    return [x, y];
  });
  const linePath = linePts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200, display:'block' }}>
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(g => (
        <line key={g} x1={P.l} x2={W-P.r} y1={P.t + g*(H-P.t-P.b)} y2={P.t + g*(H-P.t-P.b)} stroke="var(--border-soft)" strokeWidth="1" />
      ))}
      {/* bars */}
      {data.map((d, i) => {
        const x = P.l + i * stepX + (stepX - barW)/2;
        const h = d.v / maxV * (H - P.t - P.b);
        const y = H - P.b - h;
        return <rect key={i} x={x} y={y} width={barW} height={h} fill="var(--primary)" opacity={i === data.length-1 ? 1 : .8} rx="2" />;
      })}
      {/* line */}
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {linePts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === linePts.length-1 ? 4 : 2.5} fill="var(--accent)" stroke="#fff" strokeWidth="1.5" />
      ))}
      {/* x labels */}
      {data.map((d, i) => (
        <text key={i} x={P.l + i*stepX + stepX/2} y={H-8} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--font-num)">{d.d}</text>
      ))}
      {/* y label */}
      <text x="4" y={P.t + 4} fill="var(--muted)" fontSize="10">ตัน</text>
      <text x={W-P.r+4} y={P.t + 4} fill="var(--muted)" fontSize="10" textAnchor="end" style={{ fill: 'var(--accent)' }}>฿k</text>
    </svg>
  );
};

window.Dashboard = Dashboard;
