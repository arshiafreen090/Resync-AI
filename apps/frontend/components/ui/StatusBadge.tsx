import { KeywordStatus } from '@/lib/types';
import { Check, Edit2, XCircle, Clock, CircleDot } from 'lucide-react';

export function StatusBadge({ status }: { status: KeywordStatus }) {
  const configs = {
    matched: {
      label: '✓ Matched',
      classes: 'bg-brand-green/10 text-brand-green border-brand-green/20'
    },
    contextual: {
      label: '◎ Contextual Match',
      classes: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
    },
    pending: {
      label: '◎ Pending',
      classes: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
    },
    'not-applicable': {
      label: '⊗ Not Applicable',
      classes: 'bg-brand-red/10 text-brand-red border-brand-red/20'
    },
    modified: {
      label: '✎ Modified Bullet',
      classes: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
    },
    rejected: {
      label: '⊗ Rejected',
      classes: 'bg-ink/5 text-ink/30 border-transparent'
    }
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide border ${config.classes}`}>
      {config.label}
    </span>
  );
}
