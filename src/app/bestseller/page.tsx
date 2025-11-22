/**
 * 베스트셀러 페이지
 * Next.js 15 App Router
 * 경로: /bestseller
 *
 * Client Component
 */

'use client';

import { useBestseller } from '@/hooks/useBestseller';
import { BookStore } from '@/types/bestseller.types';
import Image from 'next/image';
import styles from './page.module.css';

/**
 * 베스트셀러 페이지 컴포넌트
 */
export default function BestsellerPage() {
  const {
    selectedBookStore,
    bestsellers,
    isLoading,
    error,
    changeBookStore,
    refresh,
  } = useBestseller(true); // 자동 로드

  /**
   * 서점 변경
   */
  const handleBookStoreChange = (bookStore: BookStore) => {
    changeBookStore(bookStore);
  };

  /**
   * 새로고침
   */
  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className={styles.bestsellerPage}>
      {/* 헤더 */}
      <div className={styles.pageHeader}>
        <h1>베스트셀러</h1>
        <p>주요 서점의 베스트셀러가 어떤 전자도서관에 있는지 확인하세요</p>
      </div>

      {/* 서점 선택 탭 */}
      <div className={styles.bookstoreTabs}>
        {Object.values(BookStore).map((store) => (
          <button
            key={store}
            onClick={() => handleBookStoreChange(store)}
            className={`${styles.tabButton} ${
              selectedBookStore === store ? styles.active : ''
            }`}
          >
            {store === BookStore.YES24 && 'YES24'}
            {store === BookStore.KYOBO && '교보문고'}
            {store === BookStore.ALADIN && '알라딘'}
          </button>
        ))}

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={styles.refreshButton}
        >
          🔄 새로고침
        </button>
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div className="loading-section">
          <p>베스트셀러를 불러오는 중입니다...</p>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="error-section">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* 베스트셀러 목록 */}
      {!isLoading && !error && bestsellers.length > 0 && (
        <div className={styles.bestsellersSection}>
          <div className={styles.bestsellersList}>
            {bestsellers.map((book) => (
              <div key={book.isbn} className={styles.bestsellerCard}>
                {/* 순위 */}
                <div className={styles.rankBadge}>
                  <span className={styles.rankNumber}>{book.rank}</span>
                  {book.rankChange !== undefined && book.rankChange !== 0 && (
                    <span
                      className={`${styles.rankChange} ${
                        book.rankChange > 0 ? styles.up : styles.down
                      }`}
                    >
                      {book.rankChange > 0 ? '▲' : '▼'} {Math.abs(book.rankChange)}
                    </span>
                  )}
                </div>

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
                  <p className={styles.bookPublisher}>{book.publisher}</p>

                  {book.price && (
                    <p className={styles.bookPrice}>{book.price.toLocaleString()}원</p>
                  )}

                  {book.bookStoreUrl && (
                    <a
                      href={book.bookStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.bookstoreLink}
                    >
                      서점에서 보기 →
                    </a>
                  )}
                </div>

                {/* 도서관 매칭 정보 */}
                <div className={styles.libraryMatching}>
                  <h4>전자도서관 보유 현황:</h4>

                  {book.libraryAvailability && book.libraryAvailability.length > 0 ? (
                    <ul className={styles.libraryList}>
                      {book.libraryAvailability.map((lib) => (
                        <li key={lib.libCode} className={styles.libraryItem}>
                          <span className={styles.libraryName}>{lib.libName}</span>

                          {lib.hasEBook ? (
                            <span
                              className={`${styles.availabilityBadge} ${
                                lib.isAvailable ? styles.available : styles.unavailable
                              }`}
                            >
                              {lib.isAvailable
                                ? '대출 가능'
                                : `대기 ${lib.reservationCount || 0}명`}
                            </span>
                          ) : (
                            <span className={`${styles.availabilityBadge} ${styles.notAvailable}`}>
                              전자책 없음
                            </span>
                          )}

                          {lib.detailUrl && (
                            <a
                              href={lib.detailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.libraryLink}
                            >
                              상세보기
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noLibrary}>보유 중인 전자도서관이 없습니다.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 결과 없음 */}
      {!isLoading && !error && bestsellers.length === 0 && (
        <div className="no-results-section">
          <p>베스트셀러 정보를 불러올 수 없습니다.</p>
        </div>
      )}
    </div>
  );
}
