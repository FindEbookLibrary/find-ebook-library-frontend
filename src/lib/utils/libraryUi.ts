import { Library, LibraryType } from '@/types/library.types';

/**
 * enum 값을 화면용 한글 라벨로 바꿉니다.
 * 백엔드는 enum을 보내고, 프론트는 이 값을 그대로 조건/필터/배지 텍스트에 씁니다.
 */
export const getLibraryTypeLabel = (type?: Library['type']): string => {
  switch (type) {
    case LibraryType.UNIVERSITY:
      return '대학교';
    case LibraryType.CORPORATE:
      return '회사/기관';
    case LibraryType.PUBLIC:
      return '공공도서관';
    case LibraryType.REGIONAL:
      return '시/군/구';
    case LibraryType.SPECIALIZED:
      return '전문도서관';
    default:
      return '기타';
  }
};
