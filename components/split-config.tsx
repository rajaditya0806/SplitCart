'use client';

import { Layers, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SplitMode } from '@/lib/split';
import { sanitizeAmount } from '@/lib/format';

interface SplitConfigProps {
  mode: SplitMode;
  onModeChange: (mode: SplitMode) => void;
  chunkCap: string;
  onChunkCapChange: (val: string) => void;
  numPayers: string;
  onNumPayersChange: (val: string) => void;
}

export function SplitConfig({
  mode,
  onModeChange,
  chunkCap,
  onChunkCapChange,
  numPayers,
  onNumPayersChange,
}: SplitConfigProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Split Configuration</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Choose how to break down the invoice total.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ModeCard
          active={mode === 'chunk'}
          onClick={() => onModeChange('chunk')}
          icon={<Layers className="h-5 w-5" />}
          title="Chunk Split"
          subtitle="Cap each payment"
          description="Break into installments up to a target cap, with an exact final remainder."
        />
        <ModeCard
          active={mode === 'payers'}
          onClick={() => onModeChange('payers')}
          icon={<Users className="h-5 w-5" />}
          title="Multi-Payer Split"
          subtitle="Divide proportionally"
          description="Split evenly across a set number of payers with balanced shares."
        />
      </div>

      {mode === 'chunk' ? (
        <div className="space-y-2">
          <label
            htmlFor="chunk-cap"
            className="text-sm font-medium text-foreground"
          >
            Target Cap per Payment
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-semibold text-muted-foreground">
              &#8377;
            </span>
            <input
              id="chunk-cap"
              type="text"
              inputMode="decimal"
              placeholder="1999"
              value={chunkCap}
              onChange={(e) => onChunkCapChange(sanitizeAmount(e.target.value))}
              className="h-12 w-full rounded-xl border-2 border-border bg-background pl-10 pr-4 font-mono text-lg font-semibold tabular-nums text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['999', '1999', '4999', '9999'].map((preset) => (
              <button
                key={preset}
                onClick={() => onChunkCapChange(preset)}
                className={cn(
                  'rounded-lg border px-3 py-1 font-mono text-xs font-medium transition-colors',
                  chunkCap === preset
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                )}
              >
                &#8377;{parseInt(preset).toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label
            htmlFor="num-payers"
            className="text-sm font-medium text-foreground"
          >
            Number of Payers
          </label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="num-payers"
              type="text"
              inputMode="numeric"
              placeholder="3"
              value={numPayers}
              onChange={(e) => onNumPayersChange(sanitizeAmount(e.target.value))}
              className="h-12 w-full rounded-xl border-2 border-border bg-background pl-12 pr-4 font-mono text-lg font-semibold tabular-nums text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => onNumPayersChange(n.toString())}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors',
                  numPayers === n.toString()
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all',
        active
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/40'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
            active
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground group-hover:text-foreground'
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-primary font-medium">{subtitle}</p>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {active && (
        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  );
}
