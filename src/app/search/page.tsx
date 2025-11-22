/**
 * 검색 페이지
 * Next.js 15 App Router
 * 경로: /search
 *
 * Client Component
 */

'use client';

import { useBookSearch } from '@/hooks/useBookSearch';
import { useUserStore } from '@/stores/userStore';
import Image from 'next/image';
import styles from './page.module.css';

/**
 * 검색 페이지 컴포넌트
 *
 * Next.js의 Image 컴포넌트:
 * - <img> 대신 사용
 * - 자동 이미지 최적화 (WebP 변환, 리사이징 등)
 * - Lazy Loading 자동 적용
 * - CLS (Cumulative Layout Shift) 방지
 */
export default function SearchPage() {
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

  const { accessibleLibraries } = useUserStore();

  /**
   * 검색 폼 제출
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await search({ keyword, pageNo: 1 });
  };

  /**
   * 페이지 변경
   */
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  /**
   * 전체 페이지 수 계산
   */
  const totalPages = Math.ceil(totalResults / pageSize);

  /**
   * 페이지 번호 배열 생성
   */
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

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

  return (
    <div className={styles.searchPage}>
      {/* 검색 바 */}
      <div className={styles.searchBarSection}>
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

        {/* 검색 결과 요약 */}
        {totalResults > 0 && (
          <div className={styles.searchSummary}>
            <p>
              "<strong>{keyword}</strong>" 검색 결과:{' '}
              <strong>{totalResults.toLocaleString()}</strong>건
            </p>
          </div>
        )}
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div className="loading-section">
          <p>검색 중입니다...</p>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="error-section">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* 검색 결과 */}
      {!isLoading && !error && results.length > 0 && (
        <div className={styles.resultsSection}>
          <div className={styles.resultsList}>
            {results.map((book) => (
              <div key={book.isbn} className={styles.bookCard}>
                {/* 책 표지 */}
                <div className={styles.bookCover}>
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      width={120}
                      height={160}
                      className={styles.coverImage}
                    />
                  ) : (
                    <div className={styles.noCover}>표지 없음</div>
                  )}
                </div>

                {/* 책 정보 */}
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>
                  <p className={styles.bookPublisher}>
                    {book.publisher}{' '}
                    {book.publicationYear && `· ${book.publicationYear}`}
                  </p>

                  {/* 보유 도서관 */}
                  {book.availableLibraries && book.availableLibraries.length > 0 && (
                    <div className={styles.availableLibraries}>
                      <h4>보유 도서관:</h4>
                      <ul>
                        {book.availableLibraries.slice(0, 3).map((lib) => (
                          <li key={lib.libCode}>
                            <span className={styles.libraryName}>{lib.libName}</span>
                            <span
                              className={`${styles.availabilityBadge} ${
                                lib.isAvailable ? styles.available : styles.unavailable
                              }`}
                            >
                              {lib.isAvailable ? '대출 가능' : '대출 중'}
                            </span>
                          </li>
                        ))}
                        {book.availableLibraries.length > 3 && (
                          <li className={styles.moreLibraries}>
                            그 외 {book.availableLibraries.length - 3}개 도서관
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                이전
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.paginationButton} ${
                    page === currentPage ? styles.active : ''
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}

      {/* 결과 없음 */}
      {!isLoading && !error && results.length === 0 && keyword && (
        <div className="no-results-section">
          <p>검색 결과가 없습니다.</p>
          <p>다른 검색어로 시도해보세요.</p>
        </div>
      )}
    </div>
  );
}
