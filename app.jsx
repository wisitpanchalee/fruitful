// Main app — sidebar + routing

const App = () => {
  const [page, setPage] = React.useState('dashboard');
  const [toast, setToast] = React.useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "palette": "earth",
    "sidebar": "expanded",
    "density": "normal",
    "showAlerts": true
  }/*EDITMODE-END*/;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-palette', t.palette);
    document.documentElement.setAttribute('data-sidebar', t.sidebar);
    document.documentElement.setAttribute('data-density', t.density);
  }, [t]);

  const nav = [
    { id: 'dashboard',  label: 'แดชบอร์ด',     icon: 'dashboard', group: '' },
    { id: 'purchasing', label: 'การรับซื้อ',    icon: 'cart',      group: 'จัดการรายวัน', badge: '3' },
    { id: 'suppliers',  label: 'ผู้ขาย/เกษตรกร', icon: 'users',     group: 'จัดการรายวัน' },
    { id: 'warehouse',  label: 'คลังสินค้า',    icon: 'warehouse', group: 'จัดการรายวัน' },
    { id: 'inventory',  label: 'ติดตามสต็อก',   icon: 'box',       group: 'จัดการรายวัน' },
    { id: 'payment',    label: 'การชำระเงิน',   icon: 'payment',   group: 'การเงิน', badge: '5' },
    { id: 'accounting', label: 'บัญชี',         icon: 'book',      group: 'การเงิน' },
    { id: 'reports',    label: 'รายงาน',        icon: 'chart',     group: 'การเงิน' },
    { id: 'mobile',     label: 'โหมดมือถือ',    icon: 'mobile',    group: 'อื่นๆ' },
  ];

  const pageTitleMap = Object.fromEntries(nav.map(n => [n.id, n.label]));

  const renderPage = () => {
    const props = { goto: setPage, showToast };
    switch (page) {
      case 'dashboard':  return <Dashboard {...props}/>;
      case 'purchasing': return <Purchasing {...props}/>;
      case 'suppliers':  return <Suppliers {...props}/>;
      case 'warehouse':  return <Warehouse {...props}/>;
      case 'payment':    return <Payment {...props}/>;
      case 'inventory':  return <Inventory {...props}/>;
      case 'reports':    return <Reports {...props}/>;
      case 'accounting': return <Accounting {...props}/>;
      case 'mobile':     return <MobileReceiving {...props}/>;
      default: return <Dashboard {...props}/>;
    }
  };

  // group nav
  const groups = [];
  nav.forEach(item => {
    let g = groups.find(x => x.title === item.group);
    if (!g) { g = { title: item.group, items: [] }; groups.push(g); }
    g.items.push(item);
  });

  return (
    <div className="app" data-screen-label="App">
      {/* Sidebar */}
      <aside className="sb">
        <div className="sb-logo">
          <div className="sb-logo-mark">F</div>
          <div className="sb-logo-text">
            <b>Fruitful</b>
            <span>คลังสินค้าผลไม้ · v2.4</span>
          </div>
        </div>
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            {g.title && <div className="sb-section">{g.title}</div>}
            {g.items.map(item => (
              <button key={item.id} className={`sb-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)} title={item.label}>
                <Icon name={item.icon}/>
                <span>{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </button>
            ))}
          </React.Fragment>
        ))}
        <div className="sb-foot">
          <div className="avatar">ธน</div>
          <div className="sb-foot-info">
            <b>คุณธนากร ก.</b>
            <span>ผู้จัดการคลัง</span>
          </div>
          <Icon name="settings" size={16} className="muted"/>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Top bar */}
        <div className="topbar">
          <button className="icon-btn" onClick={() => setTweak('sidebar', t.sidebar === 'expanded' ? 'compact' : 'expanded')} title="ย่อ/ขยายเมนู">
            <Icon name="burger" size={18}/>
          </button>
          <div className="crumbs">
            <span>Fruitful</span>
            <span className="sep">/</span>
            <b>{pageTitleMap[page]}</b>
          </div>
          <div className="topbar-search">
            <Icon name="search" size={14}/>
            <input placeholder="ค้นหาผู้ขาย, ใบรับซื้อ, ผลไม้, โซน..."/>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" title="แจ้งเตือน"><Icon name="bell" size={18}/><span className="dot"/></button>
            <button className="icon-btn" title="ตั้งค่า"><Icon name="settings" size={18}/></button>
            <div className="tb-divider"/>
            <div className="tb-user">
              <div className="avatar">ธน</div>
              <div className="tb-user-info">
                <b>คุณธนากร ก.</b>
                <span>ผู้จัดการคลัง</span>
              </div>
            </div>
          </div>
        </div>

        <div data-screen-label={pageTitleMap[page]}>
          {renderPage()}
        </div>
      </div>

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="ธีมสีและรูปลักษณ์">
          <TweakRadio
            label="พาเลตต์สี"
            value={t.palette}
            onChange={(v) => setTweak('palette', v)}
            options={[
              { value: 'earth',    label: 'Earthy' },
              { value: 'harvest',  label: 'Harvest' },
              { value: 'midnight', label: 'Midnight' },
            ]}
          />
          <TweakRadio
            label="แถบเมนู"
            value={t.sidebar}
            onChange={(v) => setTweak('sidebar', v)}
            options={[
              { value: 'expanded', label: 'ขยาย' },
              { value: 'compact',  label: 'ย่อ' },
            ]}
          />
          <TweakRadio
            label="ความหนาแน่น"
            value={t.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'compact',  label: 'แน่น' },
              { value: 'normal',   label: 'ปกติ' },
              { value: 'spacious', label: 'โปร่ง' },
            ]}
          />
        </TweakSection>
        <TweakSection label="ลัดไปหน้า">
          {nav.map(n => (
            <TweakButton key={n.id} label={n.label} onClick={() => setPage(n.id)}/>
          ))}
        </TweakSection>
      </TweaksPanel>

      <Toast msg={toast}/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
