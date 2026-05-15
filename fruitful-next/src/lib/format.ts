export const baht = (n: number) => '฿' + n.toLocaleString('en-US');

export const bahtShort = (n: number) => {
  if (n >= 1_000_000) return '฿' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '฿' + (n / 1_000).toFixed(1) + 'k';
  return '฿' + n.toLocaleString('en-US');
};

export const kg = (n: number) => n.toLocaleString('en-US') + ' กก.';
