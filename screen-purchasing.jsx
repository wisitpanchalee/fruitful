// Purchasing — Create Purchase Order

const Purchasing = ({ goto, showToast }) => {
  const D = window.DATA;
  const [supplierId, setSupplierId] = React.useState('S0142');
  const [lines, setLines] = React.useState([
    { id: Math.random(), fruitId: 'F02', kg: 1240, price: 92, grade: 'A' },
    { id: Math.random(), fruitId: 'F05', kg: 680, price: 38, grade: 'A' },
  ]);
  const [warehouse, setWarehouse] = React.useState('WH-A');
  const [method, setMethod] = React.useState('transfer');
  const [liveWeight, setLiveWeight] = React.useState(1240);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(null);

  // simulate live scale
  React.useEffect(() => {
    const t = setInterval(() => {
      setLiveWeight(w => {
        const target = 1240 + Math.sin(Date.now()/700) * 8;
        return Math.round(target * 10) / 10;
      });
    }, 200);
    return () => clearInterval(t);
  }, []);

  const supplier = D.suppById[supplierId];
  const subTotal = lines.reduce((s, l) => s + l.kg * l.price, 0);
  const vat = subTotal * 0.07;
  const total = subTotal + vat;

  const updateLine = (id, field, val) => {
    setLines(L => L.map(l => l.id === id ? { ...l, [field]: val } : l));
  };
  const addLine = () => {
    setLines(L => [...L, { id: Math.random(), fruitId: 'F01', kg: 0, price: 45, grade: 'A' }]);
  };
  const removeLine = (id) => setLines(L => L.filter(l => l.id !== id));

  const submit = () => {
    setConfirmOpen(false);
    setSuccess('PO-26052-0185');
    showToast('สร้างใบรับซื้อสำเร็จ · PO-26052-0185');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="crumbs" style={{ marginBottom: 6 }}>
            <span style={{cursor:'pointer'}} onClick={() => goto('dashboard')}>หน้าหลัก</span>
            <span className="sep">/</span>
            <span>การรับซื้อ</span>
            <span className="sep">/</span>
            <b>สร้างใบรับซื้อใหม่</b>
          </div>
          <h1 className="page-title">สร้างใบรับซื้อผลไม้</h1>
          <div className="page-sub">เลขที่ใบรับซื้อ · <span className="mono">PO-26052-0185</span> · ฉบับร่าง</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="print" size={14}/>พิมพ์</button>
          <button className="btn"><Icon name="download" size={14}/>บันทึกร่าง</button>
          <button className="btn btn-primary btn-lg" onClick={() => setConfirmOpen(true)}>
            <Icon name="check" size={14}/>ยืนยันรับซื้อ
          </button>
        </div>
      </div>

      <div className="po-grid">
        {/* Left: form */}
        <div className="col" style={{ gap: 16 }}>
          {/* Supplier */}
          <Section title="ผู้ขาย / เกษตรกร" action={<button className="btn btn-ghost btn-sm" onClick={() => goto('suppliers')}><Icon name="plus" size={12}/>เพิ่มผู้ขายใหม่</button>}>
            <div className="card-body">
              <div className="row" style={{ gap: 14, alignItems:'stretch' }}>
                <div className="field" style={{ flex: 2 }}>
                  <label>ผู้ขาย <span className="req">*</span></label>
                  <select className="select" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                    {D.suppliers.map(s => <option key={s.id} value={s.id}>{s.name} · {s.province}</option>)}
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>เครดิตเรตติ้ง</label>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, padding: '9px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    <Grade g={supplier.credit}/>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>เครดิต {supplier.credit}</span>
                    <span style={{ marginLeft:'auto', color:'var(--muted)', fontSize: 12 }}>{supplier.orders} ครั้ง</span>
                  </div>
                </div>
              </div>
              <div className="grid-3" style={{ marginTop: 14, gap: 14 }}>
                <Mini label="ติดต่อ" value={supplier.owner} sub={supplier.phone} icon="users"/>
                <Mini label="บัญชีรับโอน" value={supplier.bank} icon="bank" mono/>
                <Mini label="ค้างชำระ" value={baht(supplier.outstanding)} valueClass={supplier.outstanding > 0 ? 'bad' : 'good'} icon="payment"/>
              </div>
            </div>
          </Section>

          {/* Line items */}
          <Section title="รายการผลไม้" action={
            <button className="btn btn-sm" onClick={addLine}><Icon name="plus" size={12}/>เพิ่มรายการ</button>
          }>
            <div className="card-body" style={{ padding: 8 }}>
              <div className="line-item header">
                <div>ผลไม้</div>
                <div>เกรด</div>
                <div style={{ textAlign:'right' }}>น้ำหนัก (กก.)</div>
                <div style={{ textAlign:'right' }}>ราคา/กก.</div>
                <div style={{ textAlign:'right' }}>รวม</div>
                <div></div>
              </div>
              {lines.map(l => {
                const f = D.fruitById[l.fruitId];
                return (
                  <div key={l.id} className="line-item">
                    <div className="row" style={{ gap: 10, minWidth: 0 }}>
                      <FruitDot fruit={f} />
                      <select className="select" style={{ padding: '7px 10px', fontSize: 13, flex: 1, minWidth: 0 }} value={l.fruitId} onChange={e => updateLine(l.id, 'fruitId', e.target.value)}>
                        {D.fruits.map(fr => <option key={fr.id} value={fr.id}>{fr.name}</option>)}
                      </select>
                    </div>
                    <div className="grade-picker">
                      {['A','B','C','D'].map(g => (
                        <button key={g} onClick={() => updateLine(l.id, 'grade', g)} className={l.grade === g ? `active ${g}` : ''}>{g}</button>
                      ))}
                    </div>
                    <div className="input-group">
                      <input type="number" value={l.kg} onChange={e => updateLine(l.id, 'kg', +e.target.value)} style={{textAlign:'right'}}/>
                      <span className="suffix">กก.</span>
                    </div>
                    <div className="input-group">
                      <span className="prefix">฿</span>
                      <input type="number" value={l.price} onChange={e => updateLine(l.id, 'price', +e.target.value)} style={{textAlign:'right'}}/>
                    </div>
                    <div className="total-cell">{baht(l.kg * l.price)}</div>
                    <button className="del-btn" onClick={() => removeLine(l.id)}><Icon name="trash" size={14}/></button>
                  </div>
                );
              })}
              {lines.length === 0 && (
                <div className="empty-state"><Icon name="cart" size={32}/><div>ยังไม่มีรายการ — กด "เพิ่มรายการ"</div></div>
              )}
            </div>
          </Section>

          {/* Photo + notes */}
          <Section title="หลักฐานและบันทึก">
            <div className="card-body grid-2-1">
              <div className="field">
                <label>อัปโหลดใบเสร็จ / ภาพถ่าย</label>
                <div style={{ border: '1.5px dashed var(--border)', borderRadius: 10, padding: 18, textAlign:'center', background: 'var(--surface-2)' }}>
                  <Icon name="camera" size={28} className="muted"/>
                  <div style={{ fontSize: 13, marginTop: 8 }}>ลากภาพมาวาง หรือ <a href="#" style={{ color: 'var(--primary)' }}>เลือกไฟล์</a></div>
                  <div className="muted tiny" style={{ marginTop: 4 }}>JPG, PNG · ไม่เกิน 5MB</div>
                </div>
                <div className="row" style={{ gap: 8, marginTop: 8 }}>
                  <ThumbStrip />
                </div>
              </div>
              <div className="field">
                <label>หมายเหตุ</label>
                <textarea className="textarea" rows="5" placeholder="ระบุข้อมูลเพิ่มเติม เช่น สภาพผลไม้ การตรวจสอบคุณภาพ..." defaultValue="ผลไม้คุณภาพดี ขนาดมาตรฐาน ผ่านการคัดแยกแล้ว"/>
                <div className="row" style={{ marginTop: 8, gap: 8 }}>
                  <label className="row tiny" style={{ gap: 6, cursor:'pointer' }}>
                    <input type="checkbox" defaultChecked/> มีหลักฐานชั่งน้ำหนัก
                  </label>
                  <label className="row tiny" style={{ gap: 6, cursor:'pointer' }}>
                    <input type="checkbox"/> ต้องการตรวจซ้ำ
                  </label>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right: summary */}
        <div className="po-summary col" style={{ gap: 16 }}>
          {/* Scale widget */}
          <div className="scale-widget">
            <div className="lbl"><span className="live"/> เครื่องชั่งดิจิทัล · DS-2400</div>
            <div className="v">{liveWeight.toFixed(1)}<span className="unit">กก.</span></div>
            <div className="meta">
              <span>ทุเรียนหมอนทอง · เกรด A</span>
              <span style={{ color: '#f0b65a' }}>● สด</span>
            </div>
            <button className="btn btn-sm" style={{ marginTop: 6, background: 'rgba(240,182,90,.2)', color: '#f0b65a', border: '1px solid rgba(240,182,90,.3)' }}>
              <Icon name="check" size={12}/>บันทึกน้ำหนักนี้
            </button>
          </div>

          {/* Summary */}
          <Section title="สรุปใบรับซื้อ">
            <div className="card-body">
              <div className="sum-row"><span className="k">จำนวนรายการ</span><span className="v">{lines.length} รายการ</span></div>
              <div className="sum-row"><span className="k">น้ำหนักรวม</span><span className="v">{kg(lines.reduce((s,l)=>s+l.kg,0))}</span></div>
              <div className="sum-row"><span className="k">รวมเป็นเงิน</span><span className="v">{baht(subTotal)}</span></div>
              <div className="sum-row"><span className="k">ภาษีมูลค่าเพิ่ม 7%</span><span className="v">{baht(Math.round(vat))}</span></div>
              <div className="sum-row total"><span className="k">ยอดรวมสุทธิ</span><span className="v">{baht(Math.round(total))}</span></div>
            </div>
          </Section>

          {/* Logistics */}
          <Section title="จัดเก็บ & ชำระเงิน">
            <div className="card-body col" style={{ gap: 14 }}>
              <div className="field">
                <label>คลังปลายทาง</label>
                <div className="seg" style={{ width:'100%' }}>
                  {['WH-A','WH-B','WH-C','WH-D'].map(w => (
                    <button key={w} className={warehouse === w ? 'active' : ''} onClick={() => setWarehouse(w)} style={{ flex: 1 }}>{w}</button>
                  ))}
                </div>
                <div className="muted tiny" style={{ marginTop: 4 }}>โซนแนะนำ: <b>B-05</b> (ทุเรียน, 16°C, ว่าง 2,160 กก.)</div>
              </div>
              <div className="field">
                <label>วิธีชำระเงิน</label>
                <div className="col" style={{ gap: 6 }}>
                  {[
                    { id: 'transfer', icon: 'bank', label: 'โอนผ่านธนาคาร', sub: supplier.bank },
                    { id: 'qr',       icon: 'qr',   label: 'QR Pay (PromptPay)', sub: 'สแกนจ่ายทันที' },
                    { id: 'cash',     icon: 'cash', label: 'เงินสด', sub: 'พิมพ์ใบเสร็จเงินสด' },
                    { id: 'credit',   icon: 'book', label: 'เครดิต / ผ่อนชำระ', sub: 'กำหนดวันชำระภายหลัง' },
                  ].map(m => (
                    <label key={m.id} className="row" style={{
                      gap: 10, padding: 10, borderRadius: 8,
                      border: '1px solid ' + (method === m.id ? 'var(--primary)' : 'var(--border)'),
                      background: method === m.id ? 'var(--primary-soft)' : 'transparent',
                      cursor:'pointer'
                    }} onClick={() => setMethod(m.id)}>
                      <Icon name={m.icon} size={18}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{m.label}</div>
                        <div className="muted tiny">{m.sub}</div>
                      </div>
                      <div style={{ width: 16, height: 16, borderRadius:'50%', border:'2px solid ' + (method === m.id ? 'var(--primary)' : 'var(--border)'), background: method === m.id ? 'var(--primary)' : 'transparent', display:'grid', placeItems:'center' }}>
                        {method === m.id && <span style={{ width: 6, height: 6, background:'#fff', borderRadius:'50%' }}/>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="ยืนยันการรับซื้อ" footer={
        <>
          <button className="btn" onClick={() => setConfirmOpen(false)}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={submit}><Icon name="check" size={14}/>ยืนยันและชำระเงิน</button>
        </>
      }>
        <div style={{ background:'var(--surface-2)', padding: 16, borderRadius: 10, marginBottom: 14 }}>
          <div className="muted tiny">เลขที่ใบรับซื้อ</div>
          <div className="mono bold" style={{ fontSize: 16, marginTop: 2 }}>PO-26052-0185</div>
        </div>
        <div className="col" style={{ gap: 8 }}>
          <div className="sum-row"><span className="k">ผู้ขาย</span><span style={{ fontWeight: 500 }}>{supplier.name}</span></div>
          <div className="sum-row"><span className="k">รายการ</span><span className="v">{lines.length} ชนิด · {kg(lines.reduce((s,l)=>s+l.kg,0))}</span></div>
          <div className="sum-row"><span className="k">วิธีชำระ</span><PayMethod m={method}/></div>
          <div className="sum-row total"><span className="k">ยอดสุทธิ</span><span className="v">{baht(Math.round(total))}</span></div>
        </div>
      </Modal>

      {/* Success modal */}
      <Modal open={!!success} onClose={() => { setSuccess(null); goto('dashboard'); }} title="รับซื้อสำเร็จ ✓" footer={
        <>
          <button className="btn" onClick={() => setSuccess(null)}>สร้างรายการใหม่</button>
          <button className="btn btn-primary" onClick={() => { setSuccess(null); goto('dashboard'); }}>กลับหน้าหลัก</button>
        </>
      }>
        <div style={{ textAlign:'center', padding: '10px 0 20px' }}>
          <div style={{ width: 64, height: 64, margin:'0 auto 14px', borderRadius:'50%', background:'var(--primary-soft)', color:'var(--primary)', display:'grid', placeItems:'center' }}>
            <Icon name="check" size={32}/>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>บันทึกใบรับซื้อเรียบร้อย</div>
          <div className="muted" style={{ marginTop: 4 }}>เลขที่ <b className="mono">{success}</b> · ยอด <b>{baht(Math.round(total))}</b></div>
        </div>
        <div className="row" style={{ gap: 8, justifyContent:'center' }}>
          <button className="btn btn-sm"><Icon name="print" size={12}/>พิมพ์ใบรับซื้อ</button>
          <button className="btn btn-sm"><Icon name="download" size={12}/>ดาวน์โหลด PDF</button>
          <button className="btn btn-sm"><Icon name="qr" size={12}/>แสดง QR ชำระเงิน</button>
        </div>
      </Modal>
    </div>
  );
};

const Mini = ({ label, value, sub, icon, valueClass, mono }) => (
  <div style={{ background:'var(--surface-2)', borderRadius: 8, padding: 12 }}>
    <div className="row tiny muted" style={{ gap: 6 }}><Icon name={icon} size={12}/>{label}</div>
    <div className={`bold ${mono ? 'mono' : ''}`} style={{ fontSize: 14, marginTop: 4, color: valueClass === 'bad' ? 'var(--bad)' : valueClass === 'good' ? 'var(--good)' : 'inherit' }}>{value}</div>
    {sub && <div className="muted tiny">{sub}</div>}
  </div>
);

const ThumbStrip = () => (
  <>
    {[1,2].map(i => (
      <div key={i} style={{
        width: 56, height: 56, borderRadius: 8,
        background: `linear-gradient(135deg, #d4a574 0%, #8b6a3a 100%)`,
        position: 'relative', overflow:'hidden', flexShrink: 0
      }}>
        <div style={{ position:'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.1) 6px 7px)' }}/>
        <span style={{ position:'absolute', bottom: 4, right: 4, background:'rgba(0,0,0,.6)', color:'#fff', borderRadius: 3, padding:'0 4px', fontSize: 9, fontFamily:'var(--font-num)' }}>IMG_{i}</span>
      </div>
    ))}
    <button style={{ width: 56, height: 56, border: '1.5px dashed var(--border)', borderRadius: 8, background:'transparent', display:'grid', placeItems:'center', color:'var(--muted)' }}>
      <Icon name="plus" size={16}/>
    </button>
  </>
);

window.Purchasing = Purchasing;
