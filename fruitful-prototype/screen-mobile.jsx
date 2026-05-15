// Mobile receiving — phone in iOS frame, side-by-side with annotation panel

const MobileReceiving = ({ goto, showToast }) => {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">โหมดมือถือ · รับสินค้าหน้างาน</h1>
          <div className="page-sub">สำหรับเจ้าหน้าที่รับของและคนขับรถ · ใช้งานง่าย รองรับออฟไลน์</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14}/>ดาวน์โหลดแอป iOS</button>
          <button className="btn"><Icon name="download" size={14}/>ดาวน์โหลดแอป Android</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, alignItems:'start' }}>
        <MobileFrame title="1. สแกนรับของ">
          <ScreenScan/>
        </MobileFrame>
        <MobileFrame title="2. ชั่งน้ำหนัก & ตรวจคุณภาพ">
          <ScreenWeigh/>
        </MobileFrame>
        <MobileFrame title="3. ยืนยันด้วยลายเซ็น">
          <ScreenSign onSign={() => showToast('บันทึกการรับสินค้าสำเร็จ')}/>
        </MobileFrame>
      </div>

      <div className="grid-3" style={{ marginTop: 20, gap: 14 }}>
        <FeatureCard icon="qr" title="สแกน QR / บาร์โค้ด" desc="สแกนใบส่งของของผู้ขายเพื่อโหลดข้อมูลอัตโนมัติ ลดการพิมพ์ผิด"/>
        <FeatureCard icon="weight" title="เชื่อมต่อเครื่องชั่ง" desc="รับน้ำหนักจริงจากเครื่องชั่งดิจิทัลผ่าน Bluetooth"/>
        <FeatureCard icon="camera" title="ถ่ายภาพหลักฐาน" desc="บันทึกภาพผลไม้และสภาพการรับเข้า อัปโหลดอัตโนมัติเมื่อมีสัญญาณ"/>
        <FeatureCard icon="edit" title="ลายเซ็นดิจิทัล" desc="ผู้ขายและคนขับเซ็นยืนยันบนหน้าจอ บันทึกเป็นหลักฐานทันที"/>
        <FeatureCard icon="cloud" title="ออฟไลน์โหมด" desc="ทำงานต่อได้แม้สัญญาณขาดหาย ระบบจะ sync ข้อมูลเมื่อกลับมาออนไลน์"/>
        <FeatureCard icon="truck" title="GPS ติดตามรถ" desc="ดูตำแหน่งรถบรรทุกแบบ real-time แจ้งเตือนเมื่อใกล้ถึงคลัง"/>
      </div>
    </div>
  );
};

const MobileFrame = ({ title, children }) => (
  <div className="col" style={{ gap: 10, alignItems:'center' }}>
    <div style={{
      width: 280,
      borderRadius: 38,
      background: '#1a1f1a',
      padding: 8,
      boxShadow: '0 20px 60px -20px rgba(28,48,37,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        position: 'relative',
        background: '#ffffff',
        borderRadius: 32,
        overflow: 'hidden',
        height: 560,
      }}>
        {/* notch */}
        <div style={{ position:'absolute', top: 8, left: '50%', transform:'translateX(-50%)', width: 100, height: 24, background:'#1a1f1a', borderRadius: 12, zIndex: 10 }}/>
        {/* status bar */}
        <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: 38, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 22px', fontSize: 11.5, fontWeight: 600, fontFamily:'var(--font-num)', zIndex: 5 }}>
          <span>9:41</span>
          <span style={{ display:'inline-flex', gap: 4, alignItems:'center' }}>
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 7h2v3H1zM5 5h2v5H5zM9 3h2v7H9z" fill="currentColor"/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0.5" y="3" width="10" height="4" rx="1" fill="none" stroke="currentColor"/><rect x="2" y="4.5" width="6" height="1" fill="currentColor"/><rect x="11" y="4.5" width="1.5" height="1" fill="currentColor"/></svg>
          </span>
        </div>
        <div style={{ height: '100%', overflow: 'auto', paddingTop: 38 }}>{children}</div>
        {/* home indicator */}
        <div style={{ position:'absolute', bottom: 6, left: '50%', transform:'translateX(-50%)', width: 110, height: 4, background:'#1a1f1a', borderRadius: 4 }}/>
      </div>
    </div>
    <div style={{ fontWeight: 500, fontSize: 13.5, marginTop: 6 }}>{title}</div>
  </div>
);

const ScreenScan = () => (
  <div style={{ padding: '12px 14px', height: '100%', display:'flex', flexDirection:'column', gap: 14 }}>
    <div className="row" style={{ justifyContent:'space-between' }}>
      <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', display:'grid', placeItems:'center' }}><Icon name="burger" size={16}/></span>
      <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', display:'grid', placeItems:'center', position:'relative' }}>
        <Icon name="bell" size={16}/>
        <span style={{ position:'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius:'50%', background:'var(--accent)' }}/>
      </span>
    </div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>สแกนรับของ</div>
      <div className="muted tiny">วางบาร์โค้ดในกรอบเพื่อรับข้อมูล</div>
    </div>

    {/* Scanner */}
    <div style={{ position:'relative', width:'100%', aspectRatio:'1/1', background:'#1a1f1a', borderRadius: 18, overflow:'hidden' }}>
      {/* simulated camera view */}
      <div style={{ position:'absolute', inset: 0, background:'radial-gradient(circle at 50% 60%, #2a3a2e 0%, #0e1410 80%)' }}/>
      <div style={{ position:'absolute', inset: 36, border:'2px solid #f0b65a', borderRadius: 12 }}/>
      <div style={{ position:'absolute', left: 36, right: 36, top: '50%', height: 2, background:'#f0b65a', boxShadow:'0 0 10px #f0b65a' }}/>
      {/* corner marks */}
      {[['top:24','left:24','bb','rr'],['top:24','right:24','bb','ll'],['bottom:24','left:24','tt','rr'],['bottom:24','right:24','tt','ll']].map((c,i) => (
        <div key={i} style={{ position:'absolute', width: 18, height: 18, [c[0].split(':')[0]]: 24, [c[1].split(':')[0]]: 24, borderColor:'#f0b65a' }}/>
      ))}
      <div style={{ position:'absolute', bottom: 14, left: 0, right: 0, textAlign:'center', color:'#fff', fontSize: 11 }}>กล้องเปิดอยู่ · พร้อมสแกน</div>
    </div>

    <button className="btn btn-primary" style={{ justifyContent:'center', padding: 12, fontSize: 14 }}>
      <Icon name="qr" size={16}/>สแกนใบส่งของ
    </button>

    <div style={{ background:'var(--surface-2)', borderRadius: 10, padding: 12 }}>
      <div className="muted tiny" style={{ marginBottom: 6 }}>รถบรรทุกที่กำลังมา</div>
      <div className="row" style={{ gap: 10 }}>
        <span style={{ width: 36, height: 36, borderRadius: 8, background:'var(--info-soft)', color:'var(--info)', display:'grid', placeItems:'center' }}><Icon name="truck" size={18}/></span>
        <div style={{ flex: 1 }}>
          <div className="bold">BMK-3411</div>
          <div className="muted tiny">มะม่วง · 1,200 กก. · ถึงใน 14 นาที</div>
        </div>
        <Pill kind="info">ติดตาม</Pill>
      </div>
    </div>
  </div>
);

const ScreenWeigh = () => (
  <div style={{ padding: '12px 14px', height: '100%', display:'flex', flexDirection:'column', gap: 12 }}>
    <div className="row">
      <Icon name="arrow" size={16} style={{ transform:'rotate(180deg)', cursor:'pointer' }}/>
      <span style={{ fontWeight: 600, fontSize: 14, marginLeft: 8 }}>ชั่งน้ำหนัก · LOT-0184</span>
    </div>

    <div style={{ background:'var(--primary-soft)', borderRadius: 10, padding: 10 }}>
      <div className="row" style={{ gap: 8 }}>
        <FruitDot fruit={{ code: 'DR', color: '#c1a44a' }} />
        <div style={{ flex: 1 }}>
          <div className="bold tiny">ทุเรียนหมอนทอง · เกรด A</div>
          <div className="muted tiny">สวนทุเรียนวิชัย · นครศรีฯ</div>
        </div>
      </div>
    </div>

    {/* Scale display */}
    <div style={{ background:'linear-gradient(180deg, #1a1f1a 0%, #0a120c 100%)', borderRadius: 12, padding: '18px 14px', color: '#fff', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ fontSize: 10, color:'#8da095', letterSpacing:'.1em', textTransform:'uppercase' }}>
        <span style={{ display:'inline-block', width: 6, height: 6, background:'#6cbd7b', borderRadius:'50%', marginRight: 4, verticalAlign:'middle' }}/>
        เครื่องชั่งเชื่อมต่อแล้ว
      </div>
      <div style={{ fontSize: 40, fontWeight: 600, fontFamily:'var(--font-num)', lineHeight: 1.1, marginTop: 6 }}>
        1,238.6<span style={{ fontSize: 14, color:'#8da095', marginLeft: 4 }}>กก.</span>
      </div>
      <div className="tiny" style={{ color:'#8da095', marginTop: 4 }}>± 0.2 กก.</div>
    </div>

    {/* Grade selector */}
    <div>
      <div className="tiny bold muted" style={{ marginBottom: 6 }}>คัดเกรด</div>
      <div className="row" style={{ gap: 6 }}>
        {['A','B','C','D'].map((g,i) => (
          <div key={g} style={{ flex: 1, padding: 8, border:'1.5px solid ' + (i === 0 ? 'var(--primary)' : 'var(--border)'), borderRadius: 8, textAlign:'center', background: i === 0 ? 'var(--primary-soft)' : 'transparent' }}>
            <Grade g={g}/>
            <div className="tiny" style={{ marginTop: 4, fontWeight: i === 0 ? 600 : 400 }}>{['ดีเยี่ยม','ดี','พอใช้','ตก'][i]}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Photo */}
    <div>
      <div className="tiny bold muted" style={{ marginBottom: 6 }}>ภาพถ่ายหลักฐาน (2/4)</div>
      <div className="row" style={{ gap: 6 }}>
        {[1,2].map(i => (
          <div key={i} style={{ width: 56, height: 56, background:'linear-gradient(135deg, #c1a44a 0%, #8b6a3a 100%)', borderRadius: 8 }}/>
        ))}
        <div style={{ width: 56, height: 56, borderRadius: 8, border:'1.5px dashed var(--border)', display:'grid', placeItems:'center', color:'var(--muted)' }}><Icon name="camera" size={20}/></div>
      </div>
    </div>

    <button className="btn btn-primary" style={{ justifyContent:'center', padding: 12, fontSize: 14, marginTop: 'auto' }}>
      ถัดไป <Icon name="arrow" size={16}/>
    </button>
  </div>
);

const ScreenSign = ({ onSign }) => {
  const [signed, setSigned] = React.useState(false);
  return (
    <div style={{ padding: '12px 14px', height: '100%', display:'flex', flexDirection:'column', gap: 12 }}>
      <div className="row">
        <Icon name="arrow" size={16} style={{ transform:'rotate(180deg)' }}/>
        <span style={{ fontWeight: 600, fontSize: 14, marginLeft: 8 }}>ยืนยันการรับของ</span>
      </div>

      <div style={{ background:'var(--surface-2)', borderRadius: 10, padding: 12 }}>
        <div className="row" style={{ justifyContent:'space-between', marginBottom: 4 }}>
          <span className="muted tiny">เลขที่ใบรับซื้อ</span>
          <span className="mono tiny bold">PO-26052-0184</span>
        </div>
        <div className="sum-row" style={{ padding: '4px 0', fontSize: 12 }}>
          <span className="k">ทุเรียน × 1,238.6 กก.</span>
          <span className="v">฿92/กก.</span>
        </div>
        <div className="sum-row total" style={{ fontSize: 14, marginTop: 4 }}>
          <span className="k">รวม</span>
          <span className="v">฿113,951</span>
        </div>
      </div>

      <div>
        <div className="tiny bold muted" style={{ marginBottom: 6 }}>ลายเซ็นผู้ขาย</div>
        <div onClick={() => setSigned(true)} style={{ height: 100, background:'var(--surface)', border:'1.5px dashed var(--border)', borderRadius: 10, position:'relative', cursor:'pointer', overflow:'hidden' }}>
          {signed ? (
            <svg viewBox="0 0 200 80" style={{ width:'100%', height:'100%' }}>
              <path d="M20 50 Q 30 20 45 50 T 75 50 Q 90 30 110 55 L 130 35 Q 150 65 175 40" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <div style={{ position:'absolute', inset: 0, display:'grid', placeItems:'center', color:'var(--muted)', fontSize: 11 }}>
              <div style={{ textAlign:'center' }}>
                <Icon name="edit" size={20}/>
                <div style={{ marginTop: 4 }}>แตะเพื่อเซ็นชื่อ</div>
              </div>
            </div>
          )}
        </div>
        <div className="row tiny muted" style={{ marginTop: 6 }}>
          <span>นายวิชัย พันธุ์ดี</span>
          <span style={{ marginLeft:'auto' }}>15/05/2026 · 14:32</span>
        </div>
      </div>

      <button
        className={`btn ${signed ? 'btn-primary' : ''}`}
        style={{ justifyContent:'center', padding: 14, fontSize: 14, marginTop: 'auto', opacity: signed ? 1 : 0.5 }}
        disabled={!signed}
        onClick={onSign}
      >
        <Icon name="check" size={16}/>ยืนยันรับสินค้า
      </button>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card" style={{ padding: 18 }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background:'var(--primary-soft)', color:'var(--primary)', display:'grid', placeItems:'center', marginBottom: 10 }}>
      <Icon name={icon} size={20}/>
    </div>
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
    <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{desc}</div>
  </div>
);

window.MobileReceiving = MobileReceiving;
