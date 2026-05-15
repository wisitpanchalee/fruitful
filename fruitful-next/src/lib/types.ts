export type Fruit = {
  id: string;
  name: string;
  en: string;
  color: string;
  code: string;
};

export type Supplier = {
  id: string;
  name: string;
  owner: string | null;
  province: string | null;
  phone: string | null;
  bank: string | null;
  credit: string;
  total: number;
  outstanding: number;
  orders: number;
  fruits: string[];
};

export type Zone = {
  id: string;
  fruit_id: string | null;
  kg: number;
  cap: number;
  type: 'cool' | 'warm' | 'full' | 'empty';
  temp: number | null;
};

export type Purchase = {
  id: string;
  date: string;
  supplier_id: string;
  fruit_id: string;
  kg: number;
  price: number;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D';
  pay: 'paid' | 'pending' | 'partial';
  warehouse: string | null;
  zone: string | null;
};

export type Payment = {
  id: string;
  supplier_id: string;
  amount: number;
  due: string;
  method: 'cash' | 'transfer' | 'qr';
  status: 'pending' | 'approval' | 'scheduled' | 'paid';
  po: string | null;
};

export type Profile = {
  id: string;
  full_name: string;
  role: 'warehouse_manager' | 'accountant' | 'viewer';
};
