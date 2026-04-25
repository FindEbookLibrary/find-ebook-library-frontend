/**
 * 화면 전용 타입 모음
 * 백엔드 응답 계약과 분리해서, 프론트에서만 필요한 필터/선택 상태를 정의합니다.
 */

export type AffiliationUIType = 'university' | 'company' | 'region' | 'public';

export interface SearchFilters {
  avail: 'all' | 'mine' | 'avail' | 'reserve';
  libTypes: string[];
  platforms: string[];
  sort: 'avail-first' | 'mine-first' | 'most-owned' | 'newest';
}
