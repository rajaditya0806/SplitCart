'use client';

import { IndianRupee, RotateCcw } from 'lucide-react';
import { sanitizeAmount } from '@/lib/format';
import { cn } from '@/lib/utils';

interface InvoiceInputProps {
  value: string;
  onChange: (val: string) => void;
  numericValue: number;
}

export function InvoiceInput({
  value,
  onChange,
  numericValue,
}: InvoiceInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="invoice-amount"
        className="text-sm font-medium text-foreground"
      >
        Total Invoice Amount
      </label>
      <div className="group relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <IndianRupee className="h-5 w-5" />
        </div>
        <input
          id="invoice-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(sanitizeAmount(e.target.value))}
          className={cn(
            'h-14 w-full rounded-xl border-2 border-border bg-background pl-12 pr-24',
            'font-mono text-2xl font-semibold tabular-nums text-foreground',
            'placeholder:text-muted-foreground/50 placeholder:font-sans placeholder:text-lg placeholder:font-normal',
            'outline-none transition-all',
            'focus:border-primary focus:ring-4 focus:ring-primary/10',
            'group-hover:border-primary/40'
          )}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            aria-label="Clear amount"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Enter the total bill amount in Indian Rupees (&#8377;). Results update instantly.
      </p>
    </div>
  );
}
