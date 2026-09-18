export type SplitMode = 'chunk' | 'payers';

export interface InstallmentRow {
  index: number;
  amount: number;
  mdrRate: number;
  mdrFee: number;
  total: number;
  isRemainder: boolean;
  payer: string;
}

export interface SplitResult {
  rows: InstallmentRow[];
  totalCount: number;
  totalAmount: number;
  totalMDRFee: number;
  totalWithFees: number;
  effectiveMDRPercent: number;
  minChunk: number;
  maxChunk: number;
  avgChunk: number;
}

export const MDR_THRESHOLD = 2000;
export const MDR_RATE_OVER = 0.004; // 0.4%
export const MDR_RATE_UNDER = 0;

export function calculateMDR(amount: number): { rate: number; fee: number } {
  if (amount > MDR_THRESHOLD) {
    return { rate: MDR_RATE_OVER, fee: amount * MDR_RATE_OVER };
  }
  return { rate: MDR_RATE_UNDER, fee: MDR_RATE_UNDER };
}

export function chunkSplit(amount: number, cap: number): SplitResult {
  const rows: InstallmentRow[] = [];
  let remaining = Math.round(amount * 100) / 100;
  let index = 0;

  while (remaining > 0.005) {
    index++;
    let chunk = Math.min(cap, remaining);
    chunk = Math.round(chunk * 100) / 100;
    const isRemainder = remaining - chunk < 0.005;

    const { rate, fee } = calculateMDR(chunk);

    rows.push({
      index,
      amount: chunk,
      mdrRate: rate,
      mdrFee: Math.round(fee * 100) / 100,
      total: Math.round((chunk + fee) * 100) / 100,
      isRemainder,
      payer: 'Payment',
    });

    remaining = Math.round((remaining - chunk) * 100) / 100;
  }

  return finalizeResult(rows, amount);
}

export function payersSplit(amount: number, numPayers: number): SplitResult {
  if (numPayers <= 0) return finalizeResult([], amount);

  const base = Math.floor((amount / numPayers) * 100) / 100;
  const sumBase = Math.round(base * numPayers * 100) / 100;
  const remainder = Math.round((amount - sumBase) * 100) / 100;

  const rows: InstallmentRow[] = [];
  for (let i = 0; i < numPayers; i++) {
    const isLast = i === numPayers - 1;
    const chunk = isLast ? Math.round((base + remainder) * 100) / 100 : base;
    const { rate, fee } = calculateMDR(chunk);

    rows.push({
      index: i + 1,
      amount: chunk,
      mdrRate: rate,
      mdrFee: Math.round(fee * 100) / 100,
      total: Math.round((chunk + fee) * 100) / 100,
      isRemainder: isLast && remainder !== 0,
      payer: `Payer ${i + 1}`,
    });
  }

  return finalizeResult(rows, amount);
}

function finalizeResult(rows: InstallmentRow[], amount: number): SplitResult {
  const totalAmount = rows.reduce((s, r) => s + r.amount, 0);
  const totalMDRFee = rows.reduce((s, r) => s + r.mdrFee, 0);
  const totalWithFees = totalAmount + totalMDRFee;
  const chunks = rows.map((r) => r.amount);

  return {
    rows,
    totalCount: rows.length,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalMDRFee: Math.round(totalMDRFee * 100) / 100,
    totalWithFees: Math.round(totalWithFees * 100) / 100,
    effectiveMDRPercent:
      totalAmount > 0 ? (totalMDRFee / totalAmount) * 100 : 0,
    minChunk: chunks.length ? Math.min(...chunks) : 0,
    maxChunk: chunks.length ? Math.max(...chunks) : 0,
    avgChunk: chunks.length ? totalAmount / chunks.length : 0,
  };
}
