/**
 * 도서관 선택 컴포넌트
 * 사용자가 관심 도서관을 선택하고 관리할 수 있는 UI를 제공합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@stores/userStore';
import { libraryService } from '@lib/services/library.service';
import { Library } from '@types/library.types';
import styles from './LibrarySelector.module.css';

/**
 * LibrarySelector 컴포넌트
 * 도서관 목록을 표시하고 사용자가 관심 도서관을 선택/해제할 수 있습니다.
 */
export default function LibrarySelector() {
  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    accessibleLibraries,
    interestLibraryCodes,
    addInterestLibrary,
    removeInterestLibrary,
    setAccessibleLibraries,
  } = useUserStore();

  // 로컬 상태
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 컴포넌트 마운트 시 접근 가능한 도서관 목록 불러오기
   */
  useEffect(() => {
    const fetchLibraries = async () => {
      setIsLoading(true);
      try {
        // 백엔드 API에서 사용자가 접근 가능한 도서관 목록 가져오기
        const libraries = await libraryService.getAccessibleLibraries();
        setAccessibleLibraries(libraries);
      } catch (error) {
        console.error('도서관 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 접근 가능한 도서관 목록이 비어있으면 불러오기
    if (accessibleLibraries.length === 0) {
      fetchLibraries();
    }
  }, [accessibleLibraries.length, setAccessibleLibraries]);

  /**
   * 검색 키워드로 도서관 목록 필터링
   */
  const filteredLibraries = accessibleLibraries.filter((library) =>
    library.libName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  /**
   * 도서관 선택/해제 토글 핸들러
   *
   * @param libCode - 도서관 코드
   */
  const handleToggleLibrary = (libCode: string) => {
    if (interestLibraryCodes.includes(libCode)) {
      // 이미 선택된 도서관이면 제거
      removeInterestLibrary(libCode);
    } else {
      // 선택되지 않은 도서관이면 추가
      addInterestLibrary(libCode);
    }
  };

  /**
   * 전체 선택 핸들러
   */
  const handleSelectAll = () => {
    const allLibCodes = accessibleLibraries.map((lib) => lib.libCode);

    // 전체 선택 상태를 토글
    if (interestLibraryCodes.length === accessibleLibraries.length) {
      // 모두 선택되어 있으면 전체 해제
      useUserStore.getState().clearInterestLibraries();
    } else {
      // 일부만 선택되어 있거나 아무것도 선택되지 않았으면 전체 선택
      useUserStore.getState().setInterestLibraries(allLibCodes);
    }
  };

  /**
   * 도서관이 선택되었는지 확인
   *
   * @param libCode - 도서관 코드
   * @returns 선택 여부
   */
  const isSelected = (libCode: string): boolean => {
    return interestLibraryCodes.includes(libCode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>관심 도서관 선택</h2>
        <p className={styles.description}>
          검색 시 선택한 도서관의 결과만 보여집니다.
        </p>
      </div>

      {/* 검색 및 전체 선택 */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="도서관 이름으로 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSelectAll} className={styles.selectAllButton}>
          {interestLibraryCodes.length === accessibleLibraries.length
            ? '전체 해제'
            : '전체 선택'}
        </button>
      </div>

      {/* 선택된 도서관 수 표시 */}
      <div className={styles.selectedCount}>
        선택된 도서관: {interestLibraryCodes.length} / {accessibleLibraries.length}
      </div>

      {/* 도서관 목록 */}
      {isLoading ? (
        <div className={styles.loading}>도서관 목록을 불러오는 중...</div>
      ) : (
        <div className={styles.libraryList}>
          {filteredLibraries.length === 0 ? (
            <div className={styles.empty}>
              {searchKeyword
                ? '검색 결과가 없습니다.'
                : '접근 가능한 도서관이 없습니다.'}
            </div>
          ) : (
            filteredLibraries.map((library) => (
              <div
                key={library.libCode}
                className={`${styles.libraryItem} ${
                  isSelected(library.libCode) ? styles.selected : ''
                }`}
                onClick={() => handleToggleLibrary(library.libCode)}
              >
                <input
                  type="checkbox"
                  checked={isSelected(library.libCode)}
                  onChange={() => {}} // onClick에서 처리하므로 빈 함수
                  className={styles.checkbox}
                />
                <div className={styles.libraryInfo}>
                  <div className={styles.libraryName}>{library.libName}</div>
                  {library.operatingInstitution && (
                    <div className={styles.libraryInstitution}>
                      {library.operatingInstitution}
                    </div>
                  )}
                  {library.address && (
                    <div className={styles.libraryAddress}>{library.address}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
