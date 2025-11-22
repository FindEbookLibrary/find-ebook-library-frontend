/**
 * 도서관 관리 페이지
 * Next.js 15 App Router
 * 경로: /library
 *
 * Client Component
 * 사용자가 관심 도서관을 선택하고 관리할 수 있는 페이지
 */

'use client';

import LibrarySelector from '@components/library/LibrarySelector';
import { useUserStore } from '@stores/userStore';
import styles from './page.module.css';

/**
 * 도서관 관리 페이지 컴포넌트
 *
 * 사용자가 접근 가능한 도서관 목록을 보고
 * 관심 도서관을 선택하여 검색 시 필터링할 수 있습니다.
 */
export default function LibraryPage() {
  const { interestLibraryCodes, isInterestFilterEnabled } = useUserStore();

  return (
    <div className={styles.libraryPage}>
      <div className={styles.container}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>도서관 관리</h1>
          <p className={styles.pageDescription}>
            자주 사용하는 도서관을 선택하면 검색 시 해당 도서관의 결과만 볼 수 있습니다.
          </p>
        </div>

        {/* 도서관 선택 컴포넌트 */}
        <LibrarySelector />

        {/* 안내 섹션 */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>관심 도서관 기능이란?</h2>
          <div className={styles.infoContent}>
            <div className={styles.infoItem}>
              <h3>1. 도서관 선택</h3>
              <p>
                위 목록에서 자주 이용하는 도서관을 선택하세요. 여러 개의 도서관을
                동시에 선택할 수 있습니다.
              </p>
            </div>

            <div className={styles.infoItem}>
              <h3>2. 필터 활성화</h3>
              <p>
                검색 페이지에서 "관심 도서관만 보기" 토글을 켜면 선택한 도서관의
                결과만 표시됩니다.
              </p>
            </div>

            <div className={styles.infoItem}>
              <h3>3. 빠른 검색</h3>
              <p>
                관심없는 도서관의 결과를 제외하여 더 빠르고 정확한 검색 결과를 얻을
                수 있습니다.
              </p>
            </div>
          </div>

          {/* 현재 상태 표시 */}
          {interestLibraryCodes.length > 0 && (
            <div className={styles.currentStatus}>
              <h3>현재 상태</h3>
              <p>
                {interestLibraryCodes.length}개의 도서관이 선택되었습니다.
              </p>
              <p className={styles.filterStatus}>
                검색 필터:{' '}
                <strong>
                  {isInterestFilterEnabled ? '활성화됨' : '비활성화됨'}
                </strong>
              </p>
              {!isInterestFilterEnabled && (
                <p className={styles.filterHint}>
                  검색 페이지에서 필터를 활성화하면 선택한 도서관의 결과만
                  표시됩니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
