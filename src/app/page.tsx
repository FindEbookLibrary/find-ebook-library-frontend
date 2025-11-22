/**
 * 홈 페이지
 * Next.js 15 App Router
 * 경로: / (루트)
 *
 * Client Component ('use client' 필요)
 * - useState, useEffect 등 React 훅 사용
 * - 이벤트 핸들러 사용
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookSearch } from '@hooks/useBookSearch';
import { bookService } from '@lib/services/book.service';
import styles from './page.module.css';

/**
 * 홈 페이지 컴포넌트
 *
 * Next.js 15의 useRouter (next/navigation):
 * - App Router에서 사용하는 새로운 useRouter
 * - Pages Router의 useRouter (next/router)와 다름
 * - push(), replace() 등의 메서드 제공
 */
export default function HomePage() {
  // Next.js 라우터 (페이지 이동용)
  const router = useRouter();

  // 검색 훅
  const { keyword, updateKeyword, search, isLoading } = useBookSearch();

  // 인기 검색어 상태
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);

  /**
   * 검색 폼 제출 핸들러
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    // 검색 실행
    await search({ keyword });

    // 검색 페이지로 이동
    // Next.js의 router.push() - 클라이언트 사이드 네비게이션
    router.push('/search');
  };

  /**
   * 인기 검색어 클릭 핸들러
   */
  const handlePopularKeywordClick = (searchKeyword: string) => {
    updateKeyword(searchKeyword);
    search({ keyword: searchKeyword });
    router.push('/search');
  };

  /**
   * 컴포넌트 마운트 시 인기 검색어 로드
   * useEffect는 Client Component에서만 사용 가능
   */
  useEffect(() => {
    const loadPopularKeywords = async () => {
      const keywords = await bookService.getPopularKeywords(10);
      setPopularKeywords(keywords);
    };

    loadPopularKeywords();
  }, []);

  return (
    <div className={styles.homePage}>
      {/* 히어로 섹션 */}
      <div className={styles.heroSection}>
        <h1>전자도서관 통합 검색</h1>
        <p>여러 전자도서관의 책을 한 번에 검색하세요</p>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="책 제목, 저자, 출판사를 검색하세요"
            value={keyword}
            onChange={(e) => updateKeyword(e.target.value)}
            className={styles.searchInput}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={styles.searchButton}
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </form>
      </div>

      {/* 인기 검색어 섹션 */}
      <div className={styles.popularKeywordsSection}>
        <h2>인기 검색어</h2>
        <div className={styles.keywordsList}>
          {popularKeywords.map((kw, index) => (
            <button
              key={index}
              onClick={() => handlePopularKeywordClick(kw)}
              className={styles.keywordChip}
            >
              <span className={styles.keywordRank}>{index + 1}</span>
              <span className={styles.keywordText}>{kw}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 기능 소개 섹션 */}
      <div className={styles.featuresSection}>
        <h2>주요 기능</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>🔍 통합 검색</h3>
            <p>여러 전자도서관의 전자책을 한 번에 검색</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🧭 도서관 필터링</h3>
            <p>사용자의 소속에 따라 접근 가능한 도서관만 표시</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📚 베스트셀러 매칭</h3>
            <p>YES24, 교보문고, 알라딘 베스트셀러가 어떤 도서관에 있는지 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}
