// Sample data — Thai fruit purchasing & warehouse mgmt
window.DATA = (function () {
  const fruits = [
    { id: 'F01', name: 'มะม่วงน้ำดอกไม้', en: 'Mango', color: '#f0b65a', code: 'MG' },
    { id: 'F02', name: 'ทุเรียนหมอนทอง', en: 'Durian', color: '#c1a44a', code: 'DR' },
    { id: 'F03', name: 'ลำไย',         en: 'Longan', color: '#b88c5a', code: 'LN' },
    { id: 'F04', name: 'มังคุด',       en: 'Mangosteen', color: '#5e3a4a', code: 'MS' },
    { id: 'F05', name: 'เงาะโรงเรียน', en: 'Rambutan', color: '#c2502a', code: 'RB' },
    { id: 'F06', name: 'ลิ้นจี่',      en: 'Lychee', color: '#a93636', code: 'LC' },
    { id: 'F07', name: 'ส้มโอ',        en: 'Pomelo', color: '#c8d96e', code: 'PM' },
    { id: 'F08', name: 'สับปะรดภูแล',  en: 'Pineapple', color: '#e0a83a', code: 'PN' },
    { id: 'F09', name: 'แก้วมังกร',    en: 'Dragonfruit', color: '#d04c6b', code: 'DF' },
    { id: 'F10', name: 'กล้วยหอม',     en: 'Banana', color: '#dbc94a', code: 'BN' },
  ];

  const suppliers = [
    { id: 'S0142', name: 'สวนเกษตรชัยพร', owner: 'คุณชัยพร ทองแสง', province: 'จันทบุรี',  phone: '081-234-5678', bank: 'ธ.กสิกรไทย ••• 4521', total: 482300, outstanding: 38000, credit: 'A', orders: 24, fruits: ['F02','F04','F05'] },
    { id: 'S0156', name: 'ฟาร์มลุงสมชาย', owner: 'นายสมชาย ใจดี',    province: 'ราชบุรี',  phone: '089-876-5432', bank: 'ธ.ไทยพาณิชย์ ••• 0982', total: 318900, outstanding: 0,     credit: 'A', orders: 31, fruits: ['F01','F08'] },
    { id: 'S0173', name: 'สหกรณ์เชียงใหม่', owner: 'คณะสหกรณ์',       province: 'เชียงใหม่', phone: '053-410-220',  bank: 'ธ.กรุงเทพ ••• 7710',   total: 729400, outstanding: 124500, credit: 'B', orders: 42, fruits: ['F03','F06'] },
    { id: 'S0188', name: 'สวนทุเรียนวิชัย', owner: 'นายวิชัย พันธุ์ดี', province: 'นครศรีฯ',  phone: '075-336-441',  bank: 'ธ.กรุงไทย ••• 3344',   total: 1108200, outstanding: 56000, credit: 'A', orders: 18, fruits: ['F02'] },
    { id: 'S0199', name: 'ไร่มะม่วงนครปฐม', owner: 'คุณวันดี เกษตรกุล', province: 'นครปฐม',  phone: '081-922-1100', bank: 'ธ.กสิกรไทย ••• 6612',  total: 215800, outstanding: 22500, credit: 'B', orders: 15, fruits: ['F01','F07'] },
    { id: 'S0204', name: 'สวนลำไยน่าน',    owner: 'คุณสุพจน์ ดอกบัว', province: 'น่าน',     phone: '054-771-339',  bank: 'ธ.ออมสิน ••• 1450',    total: 167400, outstanding: 0,     credit: 'A', orders: 11, fruits: ['F03'] },
    { id: 'S0218', name: 'ฟาร์มแก้วมังกรสุพรรณ', owner: 'นายอำนาจ เพชรงาม', province: 'สุพรรณบุรี', phone: '087-110-2244', bank: 'ธ.กรุงเทพ ••• 9921',   total: 92400,  outstanding: 8400, credit: 'B', orders: 9,  fruits: ['F09'] },
    { id: 'S0227', name: 'สวนเงาะระยอง',  owner: 'คุณมานพ สวนสุข',  province: 'ระยอง',    phone: '038-661-882',  bank: 'ธ.ทหารไทย ••• 5512',   total: 388700, outstanding: 47200, credit: 'A', orders: 20, fruits: ['F05'] },
  ];

  // Recent transactions
  const transactions = [
    { id: 'PO-26052-0184', date: '15/05/2026', supplier: 'S0188', fruit: 'F02', kg: 1240, price: 92, total: 114080, grade: 'A', pay: 'pending',  warehouse: 'WH-A',  zone: 'B-04' },
    { id: 'PO-26052-0183', date: '15/05/2026', supplier: 'S0142', fruit: 'F05', kg: 680,  price: 38, total: 25840,  grade: 'A', pay: 'paid',     warehouse: 'WH-A',  zone: 'A-02' },
    { id: 'PO-26052-0182', date: '15/05/2026', supplier: 'S0156', fruit: 'F01', kg: 920,  price: 45, total: 41400,  grade: 'B', pay: 'paid',     warehouse: 'WH-A',  zone: 'A-01' },
    { id: 'PO-26052-0181', date: '15/05/2026', supplier: 'S0173', fruit: 'F03', kg: 2100, price: 28, total: 58800,  grade: 'B', pay: 'partial',  warehouse: 'WH-B',  zone: 'C-03' },
    { id: 'PO-26051-0180', date: '14/05/2026', supplier: 'S0227', fruit: 'F05', kg: 540,  price: 42, total: 22680,  grade: 'A', pay: 'paid',     warehouse: 'WH-A',  zone: 'A-03' },
    { id: 'PO-26051-0179', date: '14/05/2026', supplier: 'S0204', fruit: 'F03', kg: 1820, price: 26, total: 47320,  grade: 'C', pay: 'paid',     warehouse: 'WH-B',  zone: 'C-04' },
    { id: 'PO-26051-0178', date: '14/05/2026', supplier: 'S0199', fruit: 'F01', kg: 760,  price: 48, total: 36480,  grade: 'A', pay: 'pending',  warehouse: 'WH-A',  zone: 'A-01' },
    { id: 'PO-26051-0177', date: '14/05/2026', supplier: 'S0218', fruit: 'F09', kg: 420,  price: 55, total: 23100,  grade: 'B', pay: 'paid',     warehouse: 'WH-C',  zone: 'D-02' },
    { id: 'PO-26051-0176', date: '14/05/2026', supplier: 'S0142', fruit: 'F04', kg: 280,  price: 78, total: 21840,  grade: 'A', pay: 'paid',     warehouse: 'WH-A',  zone: 'A-04' },
    { id: 'PO-26050-0175', date: '13/05/2026', supplier: 'S0188', fruit: 'F02', kg: 1480, price: 90, total: 133200, grade: 'A', pay: 'paid',     warehouse: 'WH-A',  zone: 'B-04' },
    { id: 'PO-26050-0174', date: '13/05/2026', supplier: 'S0173', fruit: 'F06', kg: 320,  price: 72, total: 23040,  grade: 'A', pay: 'paid',     warehouse: 'WH-C',  zone: 'D-01' },
  ];

  // Zones in warehouse
  const zones = [
    { id: 'A-01', fruit: 'F01', kg: 4200, cap: 5000, type: 'cool', temp: 12 },
    { id: 'A-02', fruit: 'F05', kg: 1200, cap: 3000, type: 'cool', temp: 14 },
    { id: 'A-03', fruit: 'F05', kg: 540,  cap: 3000, type: 'cool', temp: 14 },
    { id: 'A-04', fruit: 'F04', kg: 280,  cap: 2000, type: 'cool', temp: 10 },
    { id: 'A-05', fruit: null,  kg: 0,    cap: 3000, type: 'empty', temp: 14 },
    { id: 'A-06', fruit: 'F07', kg: 1800, cap: 2500, type: 'warm', temp: 22 },
    { id: 'B-01', fruit: 'F08', kg: 2400, cap: 4000, type: 'warm', temp: 22 },
    { id: 'B-02', fruit: 'F10', kg: 1620, cap: 3500, type: 'warm', temp: 22 },
    { id: 'B-03', fruit: null,  kg: 0,    cap: 4000, type: 'empty', temp: 22 },
    { id: 'B-04', fruit: 'F02', kg: 4900, cap: 5000, type: 'full', temp: 16 },
    { id: 'B-05', fruit: 'F02', kg: 2840, cap: 5000, type: 'cool', temp: 16 },
    { id: 'B-06', fruit: 'F02', kg: 1100, cap: 5000, type: 'cool', temp: 16 },
    { id: 'C-01', fruit: 'F03', kg: 3800, cap: 6000, type: 'cool', temp: 13 },
    { id: 'C-02', fruit: 'F03', kg: 4200, cap: 6000, type: 'cool', temp: 13 },
    { id: 'C-03', fruit: 'F03', kg: 2100, cap: 6000, type: 'cool', temp: 13 },
    { id: 'C-04', fruit: 'F03', kg: 1820, cap: 6000, type: 'cool', temp: 13 },
    { id: 'C-05', fruit: null,  kg: 0,    cap: 5000, type: 'empty', temp: 14 },
    { id: 'C-06', fruit: null,  kg: 0,    cap: 5000, type: 'empty', temp: 14 },
    { id: 'D-01', fruit: 'F06', kg: 320,  cap: 1500, type: 'cool', temp: 8 },
    { id: 'D-02', fruit: 'F09', kg: 420,  cap: 1500, type: 'warm', temp: 18 },
    { id: 'D-03', fruit: null,  kg: 0,    cap: 1500, type: 'empty', temp: 18 },
    { id: 'D-04', fruit: null,  kg: 0,    cap: 1500, type: 'empty', temp: 18 },
    { id: 'D-05', fruit: null,  kg: 0,    cap: 1500, type: 'empty', temp: 18 },
    { id: 'D-06', fruit: null,  kg: 0,    cap: 1500, type: 'empty', temp: 18 },
  ];

  // Daily purchase trend (last 14 days)
  const trend = [
    { d: '02', v: 184, p: 232 }, { d: '03', v: 210, p: 280 }, { d: '04', v: 142, p: 198 },
    { d: '05', v: 268, p: 320 }, { d: '06', v: 312, p: 388 }, { d: '07', v: 245, p: 305 },
    { d: '08', v: 198, p: 244 }, { d: '09', v: 286, p: 348 }, { d: '10', v: 330, p: 412 },
    { d: '11', v: 295, p: 360 }, { d: '12', v: 354, p: 428 }, { d: '13', v: 388, p: 470 },
    { d: '14', v: 412, p: 502 }, { d: '15', v: 286, p: 358 },
  ];

  // Activity feed
  const activity = [
    { who: 'นายธนากร', what: 'รับซื้อ ทุเรียนหมอนทอง 1,240 กก. จาก สวนทุเรียนวิชัย', t: '5 นาทีที่แล้ว', type: 'order' },
    { who: 'ระบบ',     what: 'แจ้งเตือน: โซน B-04 ใกล้เต็ม (98%)', t: '14 นาทีที่แล้ว', type: 'warn' },
    { who: 'คุณสมหญิง', what: 'ชำระเงิน ฿41,400 ให้ ฟาร์มลุงสมชาย', t: '32 นาทีที่แล้ว', type: 'pay' },
    { who: 'AI',       what: 'แนะนำ: ราคามะม่วงคาดว่าจะลด 4% สัปดาห์หน้า', t: '1 ชม.ที่แล้ว',  type: 'ai' },
    { who: 'นายธนากร', what: 'รับซื้อ เงาะโรงเรียน 680 กก. จาก สวนเกษตรชัยพร', t: '2 ชม.ที่แล้ว',  type: 'order' },
    { who: 'ระบบ',     what: 'รถบรรทุก BMK-3411 ถึงคลัง WH-A แล้ว', t: '3 ชม.ที่แล้ว',  type: 'truck' },
    { who: 'คุณสมหญิง', what: 'อนุมัติการชำระเงิน 3 รายการ รวม ฿172,800', t: '4 ชม.ที่แล้ว',  type: 'pay' },
  ];

  // Best selling
  const topFruits = [
    { fid: 'F02', kg: 28400, rev: 2556000, change: 12.4 },
    { fid: 'F03', kg: 19800, rev: 554400,  change: 8.2 },
    { fid: 'F01', kg: 14200, rev: 639000,  change: -2.1 },
    { fid: 'F05', kg: 8900,  rev: 338200,  change: 5.6 },
    { fid: 'F04', kg: 3200,  rev: 249600,  change: 18.4 },
  ];

  // Payments queue
  const payments = [
    { id: 'PY-2026-0421', supplier: 'S0188', amount: 114080, due: '17/05/2026', method: 'transfer', status: 'pending', po: 'PO-26052-0184' },
    { id: 'PY-2026-0420', supplier: 'S0173', amount: 124500, due: '18/05/2026', method: 'transfer', status: 'pending', po: '4 รายการ' },
    { id: 'PY-2026-0419', supplier: 'S0199', amount: 22500,  due: '16/05/2026', method: 'qr',       status: 'pending', po: 'PO-26051-0178' },
    { id: 'PY-2026-0418', supplier: 'S0142', amount: 38000,  due: '20/05/2026', method: 'cash',     status: 'approval', po: '3 รายการ' },
    { id: 'PY-2026-0417', supplier: 'S0227', amount: 47200,  due: '22/05/2026', method: 'transfer', status: 'approval', po: '2 รายการ' },
    { id: 'PY-2026-0416', supplier: 'S0218', amount: 8400,   due: '23/05/2026', method: 'qr',       status: 'scheduled',po: 'PO-26051-0177' },
  ];

  const fruitById   = Object.fromEntries(fruits.map(f => [f.id, f]));
  const suppById    = Object.fromEntries(suppliers.map(s => [s.id, s]));

  return { fruits, suppliers, transactions, zones, trend, activity, topFruits, payments, fruitById, suppById };
})();
