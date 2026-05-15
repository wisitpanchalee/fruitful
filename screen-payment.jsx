// Payment System

const Payment = ({ goto, showToast }) => {
  const D = window.DATA;
  const [selected, setSelected] = React.useState([]);
  const [payOpen, setPayOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('all');

  const filtered = D.payments.filter(p => filter === 'all' || p.status === filter);
  const selectedTotal = D.payments.filter(p => selected.includes(p.id)).reduce((s, p) => s + p.amount, 0);
  const totalPending = D.payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalApproval = D.payments.filter(p => p.status === 'approval').reduce((s, p) => s + p.amount, 0);

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">การชำระเงิน</h1>
          <div className="page-sub">จัดการการชำระเงินให้ผู้ขาย · กระแสเงินสดวันนี้ <b className="n">฿284,500</b></div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="qr" size={14}/>สแกน QR ชำระ</button>
          <button className="btn btn-primary" onClick={() => setPayOpen(true)} disabled={selected.length === 0}>
            <Icon name="payment" size={14}/>ชำระที่เลือก ({selected.length})
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPI label="ค้างชำระ" icon="payment" value={bahtShort(totalPending)} delta={-2.8} deltaDir="down" accent="red" sparkData={[12,15,18,16,14,11,9]}/>
        <KPI label="รออนุมัติ" icon="check" value={bahtShort(totalApproval)} accent="orange" sparkData={[6,7,9,8,7,9,11]}/>
        <KPI label="ชำระแล้ววันนี้" icon="check" value="฿284k" delta={18.4} accent="" sparkData={[120,180,220,180,240,280,284]}/>
        <KPI label="ยอดชำระเดือนนี้" icon="coins" value="฿4.2M" delta={12.1} accent="blue" sparkData={[80,160,220,310,380,420,420]}/>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <Section title="รายการชำระเงิน" action={
          <div className="seg">
            <button className={filter==='all'?'active':''} onClick={() => setFilter('all')}>ทั้งหมด</button>
            <button className={filter==='pending'?'active':''} onClick={() => setFilter('pending')}>ค้างชำระ</button>
            <button className={filter==='approval'?'active':''} onClick={() => setFilter('approval')}>รออนุมัติ</button>
            <button className={filter==='scheduled'?'active':''} onClick={() => setFilter('scheduled')}>จัดคิว</button>
          </div>
        }>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(p=>p.id) : [])}/></th>
                  <th>เลขที่</th>
                  <th>ผู้รับเงิน</th>
                  <th className="num">ยอด</th>
                  <th>กำหนดชำระ</th>
                  <th>วิธี</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const s = D.suppById[p.supplier];
                  const isSel = selected.includes(p.id);
                  return (
                    <tr key={p.id} style={isSel ? { background: 'var(--primary-soft)' } : {}}>
                      <td><input type="checkbox" checked={isSel} onChange={() => toggle(p.id)}/></td>
                      <td>
                        <div className="row-id">{p.id}</div>
                        <div className="muted tiny mono">{p.po}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{s.name}</div>
                        <div className="muted tiny mono">{s.bank}</div>
                      </td>
                      <td className="num bold" style={{ fontSize: 14 }}>{baht(p.amount)}</td>
                      <td className="n tiny">{p.due}</td>
                      <td><PayMethod m={p.method}/></td>
                      <td><StatusPill status={p.status}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Cash flow + QR */}
        <div className="col" style={{ gap: 16 }}>
          <Section title="กระแสเงินสด 7 วัน" sub="รายรับ vs รายจ่าย">
            <div className="card-body">
              <CashFlowChart/>
              <div className="row" style={{ gap: 16, marginTop: 14, justifyContent:'center', fontSize: 12 }}>
                <span className="row" style={{gap:6}}><span style={{width:10,height:10,background:'var(--good)',borderRadius:2}}/>รายรับ</span>
                <span className="row" style={{gap:6}}><span style={{width:10,height:10,background:'var(--accent)',borderRadius:2}}/>รายจ่าย</span>
              </div>
            </div>
          </Section>

          <Section title="QR ชำระเงินด่วน" action={<Pill kind="good"><span className="dot"/>พร้อมใช้งาน</Pill>}>
            <div className="card-body" style={{ textAlign:'center' }}>
              <FakeQR/>
              <div style={{ marginTop: 12, fontSize: 13 }}>
                <div className="muted">PromptPay · 0921-xxx-3344</div>
                <div className="bold n" style={{ fontSize: 22, marginTop: 6 }}>฿114,080.00</div>
                <div className="muted tiny">PO-26052-0184 · สวนทุเรียนวิชัย</div>
              </div>
              <div className="row" style={{ gap: 8, marginTop: 14, justifyContent:'center' }}>
                <button className="btn btn-sm"><Icon name="download" size={12}/>บันทึก QR</button>
                <button className="btn btn-sm btn-primary"><Icon name="check" size={12}/>ยืนยันรับชำระ</button>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Pay modal */}
      <Modal open={payOpen} onClose={() => setPayOpen(false)} title={`ยืนยันการชำระเงิน · ${selected.length} รายการ`} size="lg" footer={
        <>
          <button className="btn" onClick={() => setPayOpen(false)}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={() => { setPayOpen(false); showToast(`ชำระเงิน ${selected.length} รายการ สำเร็จ`); setSelected([]); }}>
            <Icon name="check" size={14}/>ยืนยันโอนเงิน {baht(selectedTotal)}
          </button>
        </>
      }>
        <div className="col" style={{ gap: 8 }}>
          {D.payments.filter(p => selected.includes(p.id)).map(p => {
            const s = D.suppById[p.supplier];
            return (
              <div key={p.id} className="row" style={{ gap: 12, padding: 12, background:'var(--surface-2)', borderRadius: 8 }}>
                <PayMethod m={p.method}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  <div className="muted tiny">{s.bank} · {p.id}</div>
                </div>
                <div className="num bold">{baht(p.amount)}</div>
              </div>
            );
          })}
          <div className="sum-row total" style={{ marginTop: 8 }}><span className="k">รวมที่ต้องชำระ</span><span className="v">{baht(selectedTotal)}</span></div>
          <div className="alert info" style={{ marginTop: 6 }}>
            <Icon name="bell" size={16}/>
            <div>การชำระจะหักจากบัญชี <b>ธ.กสิกรไทย ••• 8821 (บริษัท ฟรุ๊ตซัพพลาย จก.)</b><br/>
              <span className="tiny">หลังกดยืนยัน คุณจะได้รับ OTP เพื่อยืนยันธุรกรรม</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const CashFlowChart = () => {
  const data = [
    { d: 'จ', in: 280, out: 220 },
    { d: 'อ', in: 320, out: 280 },
    { d: 'พ', in: 240, out: 310 },
    { d: 'พฤ',in: 360, out: 240 },
    { d: 'ศ', in: 420, out: 380 },
    { d: 'ส', in: 380, out: 290 },
    { d: 'อา',in: 460, out: 410 },
  ];
  const W = 380, H = 180, P = { l: 28, r: 12, t: 10, b: 22 };
  const max = Math.max(...data.flatMap(d => [d.in, d.out])) * 1.1;
  const stepX = (W - P.l - P.r) / data.length;
  const barW = stepX * 0.32;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height: 180, display:'block' }}>
      {[0,0.5,1].map(g => <line key={g} x1={P.l} x2={W-P.r} y1={P.t+g*(H-P.t-P.b)} y2={P.t+g*(H-P.t-P.b)} stroke="var(--border-soft)"/>)}
      {data.map((d, i) => {
        const cx = P.l + i*stepX + stepX/2;
        const hIn = d.in/max*(H-P.t-P.b);
        const hOut = d.out/max*(H-P.t-P.b);
        return (
          <g key={i}>
            <rect x={cx - barW - 1} y={H-P.b-hIn} width={barW} height={hIn} fill="var(--good)" rx="2"/>
            <rect x={cx + 1} y={H-P.b-hOut} width={barW} height={hOut} fill="var(--accent)" rx="2"/>
            <text x={cx} y={H-8} textAnchor="middle" fill="var(--muted)" fontSize="10">{d.d}</text>
          </g>
        );
      })}
    </svg>
  );
};

const FakeQR = () => {
  // 21x21 deterministic fake QR
  const grid = [];
  for (let y = 0; y < 21; y++) {
    const row = [];
    for (let x = 0; x < 21; x++) {
      const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (corner) {
        const onEdge = x === 0 || x === 6 || x === 14 || x === 20 || y === 0 || y === 6 || y === 14 || y === 20;
        const inEdge = (x > 1 && x < 5) || (x > 15 && x < 19);
        const inEdgeY = (y > 1 && y < 5) || (y > 15 && y < 19);
        row.push(onEdge ? 1 : (inEdge && inEdgeY ? 1 : 0));
      } else {
        row.push(((x*7 + y*13 + x*y) % 5) < 2 ? 1 : 0);
      }
    }
    grid.push(row);
  }
  return (
    <div style={{ display:'inline-block', padding: 14, background:'#fff', border:'1px solid var(--border)', borderRadius: 12 }}>
      <svg viewBox="0 0 21 21" width="160" height="160" shapeRendering="crispEdges">
        {grid.map((row, y) => row.map((v, x) => v ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1a1f1a"/> : null))}
      </svg>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 6, marginTop: 8, fontSize: 10, color:'var(--muted)' }}>
        <span style={{ width: 22, height: 22, background:'var(--primary)', color:'#fff', borderRadius:4, display:'grid', placeItems:'center', fontSize: 11, fontWeight: 700 }}>P</span>
        PromptPay
      </div>
    </div>
  );
};

window.Payment = Payment;
