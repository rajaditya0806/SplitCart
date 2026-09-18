'use client';

import { TrendingUp, Receipt, Percent, Layers3 } from 'lucide-react';
import type { SplitResult } from '@/lib/split';
import { formatINR } from '@/lib/format';

interface SummaryCardsProps {
  result: SplitResult;
  mode: string;
}

export function SummaryCards({ result, mode }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Payments',
      value: result.totalCount.toString(),
      sub: mode === 'chunk' ? 'installments' : 'payers',
      icon: <Layers3 className="h-4 w-4" />,
      accent: 'text-primary',
    },
    {
      label: 'Invoice Total',
      value: formatINR(result.totalAmount),
      sub: 'principal sum',
      icon: <Receipt className="h-4 w-4" />,
      accent: 'text-foreground',
    },
    {
      label: 'Total MDR Fees',
      value: formatINR(result.totalMDRFee),
      sub: 'gateway charges',
      icon: <TrendingUp className="h-4 w-4" />,
      accent: 'text-warning',
    },
    {
      label: 'Effective MDR',
      value: `${result.effectiveMDRPercent.toFixed(3)}%`,
      sub: 'blended rate',
      icon: <Percent className="h-4 w-4" />,
      accent: 'text-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg bg-secondary ${c.accent}`}
            >
              {c.icon}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {c.label}
            </span>
          </div>
          <p className="mt-2 font-mono text-xl font-bold tabular-nums text-foreground sm:text-2xl">
            {c.value}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
