import type { SplitResult } from './split';
import { formatINR, formatINRPlain } from './format';

export function generateCSV(result: SplitResult): string {
  const header = [
    'Payment #',
    'Payer',
    'Amount (INR)',
    'MDR Rate (%)',
    'MDR Fee (INR)',
    'Total (INR)',
    'Status',
  ].join(',');

  const rows = result.rows.map((r) =>
    [
      r.index,
      `"${r.payer}"`,
      r.amount.toFixed(2),
      (r.mdrRate * 100).toFixed(2),
      r.mdrFee.toFixed(2),
      r.total.toFixed(2),
      'Pending',
    ].join(',')
  );

  const summary = [
    '',
    `"Total Payments",${result.totalCount}`,
    `"Total Amount",${result.totalAmount.toFixed(2)}`,
    `"Total MDR Fees",${result.totalMDRFee.toFixed(2)}`,
    `"Grand Total",${result.totalWithFees.toFixed(2)}`,
    `"Effective MDR %",${result.effectiveMDRPercent.toFixed(3)}`,
  ].join('\n');

  return [header, ...rows, summary].join('\n');
}

export function generateInvoiceText(
  result: SplitResult,
  amount: number,
  mode: string,
  modeLabel: string
): string {
  const sep = '='.repeat(45);
  const dash = '-'.repeat(45);

  const lines: string[] = [];
  lines.push(sep);
  lines.push('         SPLITCART - PAYMENT SCHEDULE       ');
  lines.push(sep);
  lines.push('');
  lines.push(`Invoice Total:   ${formatINR(amount)}`);
  lines.push(`Split Mode:      ${modeLabel}`);
  lines.push(`Total Payments:  ${result.totalCount}`);
  lines.push('');
  lines.push(dash);
  lines.push(' #  | Payer       | Amount     | MDR Fee  | Total');
  lines.push(dash);

  for (const r of result.rows) {
    const num = String(r.index).padStart(2, '0');
    const payer = r.payer.padEnd(11);
    const amt = formatINRPlain(r.amount).padStart(10);
    const fee = formatINRPlain(r.mdrFee).padStart(8);
    const total = formatINRPlain(r.total).padStart(10);
    lines.push(` ${num} | ${payer} | ${amt} | ${fee} | ${total}`);
  }

  lines.push(dash);
  lines.push('');
  lines.push(`Total Amount:      ${formatINR(result.totalAmount)}`);
  lines.push(`Total MDR Fees:    ${formatINR(result.totalMDRFee)}`);
  lines.push(`Grand Total:       ${formatINR(result.totalWithFees)}`);
  lines.push(`Effective MDR:     ${result.effectiveMDRPercent.toFixed(3)}%`);
  lines.push('');
  lines.push(dash);
  lines.push('COMPLIANCE NOTICE:');
  lines.push('Transaction splitting must adhere to NPCI');
  lines.push('guidelines and standard payment aggregator');
  lines.push('acceptable-use policies. This tool is for');
  lines.push('educational and cost-comparison purposes only.');
  lines.push(sep);

  return lines.join('\n');
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateShareLink(
  amount: number,
  mode: string,
  param2: number
): string {
  const params = new URLSearchParams();
  params.set('amt', amount.toString());
  params.set('mode', mode);
  params.set('val', param2.toString());
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}
