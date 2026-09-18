'use client';

import { useMemo, useState, useEffect } from 'react';
import { Calculator, Sparkles, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ComplianceBanner } from '@/components/compliance-banner';
import { InvoiceInput } from '@/components/invoice-input';
import { SplitConfig } from '@/components/split-config';
import { SummaryCards } from '@/components/summary-cards';
import { BreakdownTable } from '@/components/breakdown-table';
import { ExportButtons } from '@/components/export-buttons';
import { parseAmount } from '@/lib/format';
import {
  chunkSplit,
  payersSplit,
  type SplitMode,
  type SplitResult,
} from '@/lib/split';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<SplitMode>('chunk');
  const [chunkCap, setChunkCap] = useState('1999');
  const [numPayers, setNumPayers] = useState('3');

  const numericAmount = parseAmount(amount);
  const capValue = parseAmount(chunkCap);
  const payerCount = Math.max(1, Math.floor(parseAmount(numPayers)));

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amt = params.get('amt');
    const m = params.get('mode');
    const val = params.get('val');
    if (amt) setAmount(amt);
    if (m === 'chunk' || m === 'payers') setMode(m);
    if (val) {
      if (m === 'payers') setNumPayers(val);
      else setChunkCap(val);
    }
  }, []);

  const result: SplitResult = useMemo(() => {
    if (numericAmount <= 0) {
      return {
        rows: [],
        totalCount: 0,
        totalAmount: 0,
        totalMDRFee: 0,
        totalWithFees: 0,
        effectiveMDRPercent: 0,
        minChunk: 0,
        maxChunk: 0,
        avgChunk: 0,
      };
    }
    if (mode === 'chunk') {
      if (capValue <= 0) {
        return {
          rows: [],
          totalCount: 0,
          totalAmount: 0,
          totalMDRFee: 0,
          totalWithFees: 0,
          effectiveMDRPercent: 0,
          minChunk: 0,
          maxChunk: 0,
          avgChunk: 0,
        };
      }
      return chunkSplit(numericAmount, capValue);
    }
    return payersSplit(numericAmount, payerCount);
  }, [numericAmount, mode, capValue, payerCount]);

  const modeLabel =
    mode === 'chunk'
      ? `Chunk Split (cap \u20B9${capValue.toLocaleString('en-IN')})`
      : `Multi-Payer Split (${payerCount} payers)`;

  const hasResults = result.rows.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Calculator className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-primary/40" />
                <span className="h-2 w-2 rounded-full bg-primary" />
              </span>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                SplitCart
              </h1>
              <p className="text-xs text-muted-foreground">
                Payment Breakdown &amp; Bill Splitter
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Real-time
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div className="relative border-b border-border/40 bg-dots">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Transparent fee breakdowns
            </div>
            <h2 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Split large invoices into{' '}
              <span className="text-primary">transparent micro-installments</span>{' '}
              or balanced multi-party shares
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Enter a total, choose your split strategy, and get an itemized
              schedule with MDR fee transparency in Indian Rupees.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left: Inputs */}
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <InvoiceInput
                value={amount}
                onChange={setAmount}
                numericValue={numericAmount}
              />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <SplitConfig
                mode={mode}
                onModeChange={setMode}
                chunkCap={chunkCap}
                onChunkCapChange={setChunkCap}
                numPayers={numPayers}
                onNumPayersChange={setNumPayers}
              />
            </div>
            <ComplianceBanner />
          </div>

          {/* Right: Results */}
          <div className="space-y-5 lg:col-span-3">
            {hasResults ? (
              <div className="space-y-5 animate-fade-in-up">
                <SummaryCards result={result} mode={mode} />

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                  <BreakdownTable result={result} mode={mode} />
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Export &amp; Share
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Download or share the payment schedule
                    </p>
                  </div>
                  <ExportButtons
                    result={result}
                    amount={numericAmount}
                    mode={mode}
                    modeLabel={modeLabel}
                  />
                </div>
              </div>
            ) : (
              <EmptyState amount={numericAmount} mode={mode} capValue={capValue} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              SplitCart &mdash; For educational and cost-comparison purposes only.
            </p>
            <p className="text-xs text-muted-foreground">
              MDR rates: 0.4% above &#8377;2,000 &middot; &#8377;0 below threshold
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmptyState({
  amount,
  mode,
  capValue,
}: {
  amount: number;
  mode: SplitMode;
  capValue: number;
}) {
  const needsCap = mode === 'chunk' && capValue <= 0;
  const hasAmount = amount > 0;

  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Calculator className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {!hasAmount
          ? 'Enter an invoice amount to begin'
          : needsCap
            ? 'Set a target cap to split'
            : 'Ready to calculate'}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {!hasAmount
          ? 'Type a total in the invoice field on the left, and your breakdown will appear here instantly.'
          : needsCap
            ? 'Enter a cap amount for each chunk payment to see the installment schedule.'
            : 'Your payment breakdown will appear here with full MDR fee transparency.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          Indian numbering format
        </span>
        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          Real-time calculation
        </span>
        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          CSV / PDF export
        </span>
      </div>
    </div>
  );
}
