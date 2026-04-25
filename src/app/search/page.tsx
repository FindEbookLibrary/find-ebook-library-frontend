import { Suspense } from 'react';

import SearchExperience from '@components/search/SearchExperience';

function SearchPageFallback() {
  return <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-5 md:px-8">검색 결과를 불러오는 중...</div>;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchExperience />
    </Suspense>
  );
}
