/**
 * /search 경로는 홈 검색과 중복되므로 루트로 리다이렉트합니다.
 * Server Component로 두어 클라이언트 번들을 최소화합니다.
 */

import { redirect } from 'next/navigation';

export default function SearchRedirectPage() {
  redirect('/');
}
