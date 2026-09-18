'use client';

import { ShieldCheck, X, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ComplianceBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 sm:px-5 sm:py-4 transition-all',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning/20 text-warning">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Compliance &amp; Terms Notice
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Transaction splitting must adhere to NPCI guidelines and standard
            payment aggregator acceptable-use policies. This tool is for
            educational and cost-comparison purposes only.
          </p>
          {expanded && (
            <div className="mt-3 space-y-1.5 rounded-lg bg-card/60 p-3 text-xs text-muted-foreground">
              <p className="flex gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                Splitting payments to circumvent MDR fees or gateway limits may
                violate your payment aggregator&apos;s terms of service.
              </p>
              <p className="flex gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                MDR rates shown (0.4% above &#8377;2,000, &#8377;0 below) are
                illustrative and may differ from your actual gateway agreement.
              </p>
              <p className="flex gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                Always consult your payment partner before implementing split-
                payment workflows in production.
              </p>
            </div>
          )}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 text-xs font-medium text-warning underline-offset-2 hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-warning/20 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
