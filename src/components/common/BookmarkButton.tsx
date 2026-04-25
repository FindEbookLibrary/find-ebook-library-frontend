/**
 * 북마크 버튼 컴포넌트
 * 책을 북마크에 추가하거나 제거할 수 있는 버튼
 */

'use client';

import { useBookmarkStore } from '@stores/bookmarkStore';
import { ReadStatus } from '@/types/bookmark.types';
import { EBook } from '@/types/book.types';
import styles from './BookmarkButton.module.css';

/**
 * BookmarkButton Props
 */
interface BookmarkButtonProps {
  /** 책 정보 */
  book: EBook;

  /** 버튼 크기 */
  size?: 'small' | 'medium' | 'large';

  /** 텍스트 표시 여부 */
  showText?: boolean;
}

/**
 * BookmarkButton 컴포넌트
 *
 * @param props - 컴포넌트 props
 */
export default function BookmarkButton({
  book,
  size = 'medium',
  showText = true,
}: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();

  const bookmarked = isBookmarked(book.isbn);

  /**
   * 북마크 토글 핸들러
   */
  const handleToggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(book.isbn);
    } else {
      addBookmark({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        coverImage: book.coverImage,
        readStatus: ReadStatus.WANT_TO_READ, // 기본값: 읽고 싶음
      });
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      className={`${styles.bookmarkButton} ${styles[size]} ${
        bookmarked ? styles.bookmarked : ''
      }`}
      aria-label={bookmarked ? '북마크 제거' : '북마크 추가'}
      title={bookmarked ? '북마크 제거' : '북마크 추가'}
    >
      {/* 북마크 아이콘 (하트 또는 별) */}
      <span className={styles.icon}>{bookmarked ? '★' : '☆'}</span>

      {/* 텍스트 표시 */}
      {showText && (
        <span className={styles.text}>
          {bookmarked ? '북마크됨' : '북마크'}
        </span>
      )}
    </button>
  );
}
