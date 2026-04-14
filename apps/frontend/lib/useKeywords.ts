/**
 * useKeywords — maps backend sessionKeywords → frontend Keyword[] format.
 * Falls back to MOCK_KEYWORDS when no real session exists.
 */
import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_KEYWORDS } from '@/lib/mock-data';
import type { Keyword, BackendKeyword } from '@/lib/types';

/** Convert backend match_type + live status override → frontend KeywordStatus */
function mapToStatus(kw: BackendKeyword, overrideStatus?: string): Keyword['status'] {
  if (overrideStatus) return overrideStatus as Keyword['status'];
  if (kw.match_type === 'matched') return 'matched';
  if (kw.match_type === 'not_applicable') return 'not-applicable';
  if (kw.match_type === 'contextual') return 'contextual';
  // 'modification' | 'addition' — pending until user decides
  if (kw.user_decision === 'accepted') return 'modified';
  if (kw.user_decision === 'rejected') return 'rejected';
  return 'pending';
}

export function mapBackendKeyword(kw: BackendKeyword, statusOverride?: string): Keyword {
  return {
    id: kw.id,
    name: kw.keyword,
    status: mapToStatus(kw, statusOverride),
    placement: kw.placement || kw.section || 'Resume',
    originalBullet: kw.original_bullet ?? undefined,
    rewrittenBullet: kw.modified_bullet ?? undefined,
    clarifyingQuestion: kw.clarifying_question ?? undefined,
    whyFlagged: kw.reasoning ?? undefined,
    proposedAddition: kw.added_bullet ?? undefined,
  };
}

/**
 * Returns frontend Keyword[].
 * If a real session exists uses sessionKeywords, else falls back to MOCK_KEYWORDS.
 * Always respects the live keywordStatuses overrides so Accept/Reject are reflected instantly.
 */
export function useKeywords(): Keyword[] {
  const { sessionKeywords, keywordStatuses } = useDashboardStore();

  if (sessionKeywords.length === 0) {
    // No real session yet — use mock data (dev / pre-flow)
    return MOCK_KEYWORDS.map(kw => ({
      ...kw,
      status: (keywordStatuses[kw.id] as Keyword['status']) || kw.status,
    }));
  }

  return sessionKeywords.map(kw =>
    mapBackendKeyword(kw, keywordStatuses[kw.id]),
  );
}
