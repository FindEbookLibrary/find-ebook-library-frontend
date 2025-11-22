/**
 * 관심 도서관 필터 토글 컴포넌트
 * 검색 결과를 관심 도서관으로 필터링하는 기능을 제공합니다.
 */

'use client';

import { useUserStore } from '@stores/userStore';
import styles from './InterestLibraryFilter.module.css';

/**
 * InterestLibraryFilter 컴포넌트
 * 관심 도서관 필터를 켜고 끌 수 있는 토글 스위치를 제공합니다.
 */
export default function InterestLibraryFilter() {
  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    interestLibraryCodes,
    isInterestFilterEnabled,
    setInterestFilterEnabled,
  } = useUserStore();

  /**
   * 필터 토글 핸들러
   */
  const handleToggle = () => {
    setInterestFilterEnabled(!isInterestFilterEnabled);
  };

  // 관심 도서관이 하나도 없으면 컴포넌트를 렌더링하지 않음
  if (interestLibraryCodes.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.label}>관심 도서관만 보기</div>
          <div className={styles.count}>
            {interestLibraryCodes.length}개 도서관 선택됨
          </div>
        </div>

        {/* 토글 스위치 */}
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isInterestFilterEnabled}
            onChange={handleToggle}
            className={styles.checkbox}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* 필터가 활성화되었을 때 안내 메시지 */}
      {isInterestFilterEnabled && (
        <div className={styles.activeMessage}>
          관심 도서관 필터가 활성화되었습니다. 선택한 {interestLibraryCodes.length}개 도서관의 결과만 표시됩니다.
        </div>
      )}
    </div>
  );
}
