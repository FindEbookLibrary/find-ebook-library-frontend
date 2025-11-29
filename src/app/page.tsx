/**
 * 홈 페이지
 * - 구글처럼 검색창만 남긴 단일 화면
 * - 검색 결과를 같은 페이지에서 바로 노출
 */

'use client';

import { useState, useEffect } from 'react';
import { useBookSearch } from '@hooks/useBookSearch';
import { bookService } from '@lib/services/book.service';
import styles from './page.module.css';

export default function HomePage() {
  // 검색 훅 (검색어, 결과, 페이징 등)
  const {
    keyword,
    results,
    currentPage,
    pageSize,
    totalResults,
    isLoading,
    error,
    search,
    changePage,
    updateKeyword,
  } = useBookSearch();

  // 인기 검색어 상태 (빠른 입력용)
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);

  /**
   * 검색 제출 핸들러
   * - 빈 문자열 방지 후 검색 실행
   * - 동일 페이지에서 결과 표시
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    await search({ keyword, pageNo: 1 });
  };

  /**
   * 빠른 키워드 클릭 핸들러
   * - 선택 키워드로 바로 검색 실행
   */
  const handleQuickKeyword = (searchKeyword: string) => {
    updateKeyword(searchKeyword);
    search({ keyword: searchKeyword, pageNo: 1 });
  };

  /**
   * 페이지 변경 핸들러
   * - 검색어 유지한 상태에서 페이지 이동
   */
  const handlePageChange = (page: number) => {
    changePage(page);
    search({ keyword, pageNo: page });
  };

  /**
   * 페이지 번호 계산 (간단한 5개 창)
   */
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const totalPages = Math.ceil(totalResults / pageSize);

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  /**
   * 인기 검색어 초기 로드
   * - 상위 5개만 빠른 검색 버튼으로 노출
   */
  useEffect(() => {
    const loadPopularKeywords = async () => {
      const keywords = await bookService.getPopularKeywords(5);
      setPopularKeywords(keywords);
    };

    loadPopularKeywords();
  }, []);

  return (
    <div className={styles.page}>
      {/* 브랜드 + 검색바 */}
      <div className={styles.hero}>
        <p className={styles.logo}>전자도서관 통합 검색</p>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="책 제목, 저자, 출판사를 검색하세요"
            value={keyword}
            onChange={(e) => updateKeyword(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" disabled={isLoading} className={styles.searchButton}>
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </form>
      </div>
    </div>
  );
}
