import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fruitful · ระบบจัดการรับซื้อผลไม้และคลังสินค้า',
  description: 'Smart fruit purchasing and warehouse management',
};

export const viewport: Viewport = {
  width: 1280,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" data-palette="earth" data-sidebar="expanded" data-density="normal">
      <body>{children}</body>
    </html>
  );
}
