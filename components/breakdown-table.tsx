'use client';

import {
  CircleDot,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import type { SplitResult } from '@/lib/split';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';

interface BreakdownTableProps {
  result: SplitResult;
  mode: string;
}

export function BreakdownTable({ result, mode }: BreakdownProps) {
  if (result.rows.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Payment Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            {mode === 'chunk'
              ? 'Itemized installments with MDR fee transparency'
              : 'Per-payer shares with MDR fee transparency'}
          </p>
        </div>
        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {result.totalCount} {mode === 'chunk' ? 'payments' : 'payers'}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {mode === 'chunk' ? 'Payment' : 'Payer'}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                MDR Rate
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                MDR Fee
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr
                key={row.index}
                className={cn(
                  'border-b border-border/50 transition-colors hover:bg-secondary/30',
                  i === result.rows.length - 1 && 'border-b-0'
                )}
              >
                <td className="px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-bold text-muted-foreground">
                    {row.index}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    {row.payer}
                  </span>
                  {row.isRemainder && (
                    <span className="ml-2 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                      Remainder
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-foreground">
                  {formatINR(row.amount)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {row.mdrRate > 0 ? `${(row.mdrRate * 100).toFixed(1)}%` : 'Free'}
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right font-mono text-xs tabular-nums',
                    row.mdrFee > 0 ? 'text-warning' : 'text-muted-foreground'
                  )}
                >
                  {formatINR(row.mdrFee)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-primary">
                  {formatINR(row.total)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      <CircleDot className="h-3 w-3 text-muted-foreground" />
                      Pending
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-secondary/40">
              <td colSpan={2} className="px-4 py-3 text-sm font-bold text-foreground">
                Grand Total
              </td>
              <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-foreground">
                {formatINR(result.totalAmount)}
              </td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-warning">
                {formatINR(result.totalMDRFee)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-base font-bold tabular-nums text-primary">
                {formatINR(result.totalWithFees)}
              </td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {result.rows.map((row) => (
          <div
            key={row.index}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-bold text-muted-foreground">
                  {row.index}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {row.payer}
                </span>
                {row.isRemainder && (
                  <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                    Remainder
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                <CircleDot className="h-3 w-3" />
                Pending
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                  {formatINR(row.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">MDR Fee</p>
                <p
                  className={cn(
                    'font-mono text-sm font-semibold tabular-nums',
                    row.mdrFee > 0 ? 'text-warning' : 'text-muted-foreground'
                  )}
                >
                  {formatINR(row.mdrFee)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-mono text-sm font-bold tabular-nums text-primary">
                  {formatINR(row.total)}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-xl border-2 border-border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Grand Total</span>
            <span className="font-mono text-lg font-bold tabular-nums text-primary">
              {formatINR(result.totalWithFees)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Principal: {formatINR(result.totalAmount)}</span>
            <span>Fees: {formatINR(result.totalMDRFee)}</span>
          </div>
        </div>
      </div>

      {/* Fee insight bar */}
      {result.totalMDRFee > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-warning/20 bg-warning/5 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              Fee insight:
            </span>{' '}
            {formatINR(result.totalMDRFee)} in MDR fees across{' '}
            {result.totalCount} payments. Effective blended rate:{' '}
            <span className="font-mono font-semibold text-warning">
              {result.effectiveMDRPercent.toFixed(3)}%
            </span>
            . Splitting into sub-&#8377;2,000 chunks saves{' '}
            {formatINR(
              result.rows.reduce(
                (s, r) => s + (r.mdrRate === 0 ? r.amount * 0.004 : 0),
                0
              )
            )}{' '}
            vs. a single payment.
          </p>
        </div>
      )}
    </div>
  );
}

type BreakdownProps = BreakdownTableProps;
