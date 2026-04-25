/**
 * 서재 페이지
 * Next.js 15 App Router
 * 경로: /bookshelf
 *
 * Client Component
 * 사용자가 북마크한 책들을 볼 수 있는 페이지
 */

'use client';

import { useState } from 'react';
import { useBookmarkStore } from '@stores/bookmarkStore';
import { ReadStatus, BookmarkSortBy } from '@/types/bookmark.types';
import BookmarkButton from '@components/common/BookmarkButton';
import Image from 'next/image';
import styles from './page.module.css';

/**
 * 서재 페이지 컴포넌트
 */
export default function BookshelfPage() {
  const {
    bookmarks,
    filters,
    setFilters,
    getFilteredBookmarks,
    updateBookmark,
  } = useBookmarkStore();

  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 필터링된 북마크 가져오기
   */
  const filteredBookmarks = getFilteredBookmarks();

  /**
   * 읽음 상태 변경 핸들러
   *
   * @param isbn - 책 ISBN
   * @param readStatus - 새로운 읽음 상태
   */
  const handleUpdateReadStatus = (isbn: string, readStatus: ReadStatus) => {
    updateBookmark(isbn, { readStatus });
  };

  /**
   * 정렬 변경 핸들러
   *
   * @param sortBy - 정렬 기준
   */
  const handleSortChange = (sortBy: BookmarkSortBy) => {
    setFilters({ ...filters, sortBy });
  };

  /**
   * 읽음 상태 필터 변경 핸들러
   *
   * @param readStatus - 읽음 상태
   */
  const handleReadStatusFilter = (readStatus?: ReadStatus) => {
    setFilters({ ...filters, readStatus });
  };

  /**
   * 검색 핸들러
   */
  const handleSearch = () => {
    setFilters({ ...filters, keyword: searchKeyword });
  };

  return (
    <div className={styles.bookshelfPage}>
      <div className={styles.container}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>내 서재</h1>
          <p className={styles.bookmarkCount}>
            총 {bookmarks.length}권의 책이 저장되어 있습니다.
          </p>
        </div>

        {/* 필터 및 검색 영역 */}
        <div className={styles.filterSection}>
          {/* 검색 */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="책 제목, 저자, 출판사로 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              검색
            </button>
          </div>

          {/* 필터 버튼들 */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>읽음 상태:</label>
              <button
                onClick={() => handleReadStatusFilter(undefined)}
                className={`${styles.filterButton} ${
                  !filters.readStatus ? styles.active : ''
                }`}
              >
                전체
              </button>
              <button
                onClick={() => handleReadStatusFilter(ReadStatus.WANT_TO_READ)}
                className={`${styles.filterButton} ${
                  filters.readStatus === ReadStatus.WANT_TO_READ
                    ? styles.active
                    : ''
                }`}
              >
                읽고 싶음
              </button>
              <button
                onClick={() => handleReadStatusFilter(ReadStatus.READING)}
                className={`${styles.filterButton} ${
                  filters.readStatus === ReadStatus.READING ? styles.active : ''
                }`}
              >
                읽는 중
              </button>
              <button
                onClick={() => handleReadStatusFilter(ReadStatus.COMPLETED)}
                className={`${styles.filterButton} ${
                  filters.readStatus === ReadStatus.COMPLETED ? styles.active : ''
                }`}
              >
                읽음
              </button>
            </div>

            <div className={styles.filterGroup}>
              <label>정렬:</label>
              <select
                value={filters.sortBy || BookmarkSortBy.RECENTLY_ADDED}
                onChange={(e) =>
                  handleSortChange(e.target.value as BookmarkSortBy)
                }
                className={styles.sortSelect}
              >
                <option value={BookmarkSortBy.RECENTLY_ADDED}>
                  최근 추가순
                </option>
                <option value={BookmarkSortBy.OLDEST_FIRST}>오래된순</option>
                <option value={BookmarkSortBy.TITLE_ASC}>제목순</option>
                <option value={BookmarkSortBy.AUTHOR_ASC}>저자순</option>
                <option value={BookmarkSortBy.RATING_DESC}>평점순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 북마크 목록 */}
        {filteredBookmarks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {bookmarks.length === 0
                ? '아직 저장한 책이 없습니다.'
                : '검색 결과가 없습니다.'}
            </p>
            <p className={styles.emptyHint}>
              검색 페이지에서 마음에 드는 책을 북마크해보세요!
            </p>
          </div>
        ) : (
          <div className={styles.bookmarkGrid}>
            {filteredBookmarks.map((bookmark) => (
              <div key={bookmark.isbn} className={styles.bookmarkCard}>
                {/* 책 표지 */}
                <div className={styles.bookCover}>
                  {bookmark.coverImage ? (
                    <Image
                      src={bookmark.coverImage}
                      alt={bookmark.title}
                      width={150}
                      height={200}
                      className={styles.coverImage}
                    />
                  ) : (
                    <div className={styles.noCover}>표지 없음</div>
                  )}
                </div>

                {/* 책 정보 */}
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{bookmark.title}</h3>
                  <p className={styles.bookAuthor}>{bookmark.author}</p>
                  <p className={styles.bookPublisher}>{bookmark.publisher}</p>

                  {/* 읽음 상태 선택 */}
                  <div className={styles.readStatusSelect}>
                    <select
                      value={bookmark.readStatus}
                      onChange={(e) =>
                        handleUpdateReadStatus(
                          bookmark.isbn,
                          e.target.value as ReadStatus
                        )
                      }
                      className={styles.statusDropdown}
                    >
                      <option value={ReadStatus.WANT_TO_READ}>
                        읽고 싶음
                      </option>
                      <option value={ReadStatus.READING}>읽는 중</option>
                      <option value={ReadStatus.COMPLETED}>읽음</option>
                    </select>
                  </div>

                  {/* 북마크 제거 버튼 */}
                  <div className={styles.actionButtons}>
                    <BookmarkButton
                      book={{
                        isbn: bookmark.isbn,
                        title: bookmark.title,
                        author: bookmark.author,
                        publisher: bookmark.publisher,
                        coverImage: bookmark.coverImage,
                      }}
                      size="small"
                      showText={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
