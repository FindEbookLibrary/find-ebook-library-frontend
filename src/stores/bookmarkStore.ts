/**
 * 북마크 상태 관리 Store
 * 사용자가 저장한 책과 서재 정보를 관리합니다.
 */

import { create } from 'zustand';
import {
  Bookmark,
  BookshelfFolder,
  BookmarkFilters,
  BookmarkSortBy,
} from '@/types/bookmark.types';

/**
 * 북마크 Store의 상태 인터페이스
 */
interface BookmarkState {
  /** 북마크 목록 */
  bookmarks: Bookmark[];

  /** 서재 폴더 목록 */
  folders: BookshelfFolder[];

  /** 현재 적용된 필터 */
  filters: BookmarkFilters;

  /* ===== Actions (상태를 변경하는 함수들) ===== */

  /**
   * 북마크 추가
   *
   * @param bookmark - 추가할 북마크 정보
   */
  addBookmark: (bookmark: Omit<Bookmark, 'addedAt'>) => void;

  /**
   * 북마크 제거
   *
   * @param isbn - 제거할 책의 ISBN
   */
  removeBookmark: (isbn: string) => void;

  /**
   * 북마크 업데이트
   *
   * @param isbn - 업데이트할 책의 ISBN
   * @param updates - 업데이트할 필드
   */
  updateBookmark: (isbn: string, updates: Partial<Bookmark>) => void;

  /**
   * 책이 북마크되어 있는지 확인
   *
   * @param isbn - 확인할 책의 ISBN
   * @returns 북마크 여부
   */
  isBookmarked: (isbn: string) => boolean;

  /**
   * 북마크 가져오기
   *
   * @param isbn - 가져올 책의 ISBN
   * @returns 북마크 정보 (없으면 undefined)
   */
  getBookmark: (isbn: string) => Bookmark | undefined;

  /**
   * 폴더 생성
   *
   * @param name - 폴더 이름
   * @param description - 폴더 설명
   * @param color - 폴더 색상
   * @returns 생성된 폴더 ID
   */
  createFolder: (name: string, description?: string, color?: string) => string;

  /**
   * 폴더 삭제
   *
   * @param folderId - 삭제할 폴더 ID
   */
  deleteFolder: (folderId: string) => void;

  /**
   * 폴더 업데이트
   *
   * @param folderId - 업데이트할 폴더 ID
   * @param updates - 업데이트할 필드
   */
  updateFolder: (folderId: string, updates: Partial<BookshelfFolder>) => void;

  /**
   * 폴더에 책 추가
   *
   * @param folderId - 폴더 ID
   * @param isbn - 추가할 책의 ISBN
   */
  addBookToFolder: (folderId: string, isbn: string) => void;

  /**
   * 폴더에서 책 제거
   *
   * @param folderId - 폴더 ID
   * @param isbn - 제거할 책의 ISBN
   */
  removeBookFromFolder: (folderId: string, isbn: string) => void;

  /**
   * 필터 설정
   *
   * @param filters - 적용할 필터
   */
  setFilters: (filters: BookmarkFilters) => void;

  /**
   * 필터 초기화
   */
  clearFilters: () => void;

  /**
   * 필터링 및 정렬된 북마크 목록 가져오기
   *
   * @returns 필터링 및 정렬된 북마크 목록
   */
  getFilteredBookmarks: () => Bookmark[];
}

const canUseStorage = (): boolean => typeof window !== 'undefined';

/**
 * 로컬 스토리지에서 북마크 불러오기
 */
const loadBookmarksFromStorage = (): Bookmark[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const stored = localStorage.getItem('bookmarks');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('북마크 로드 실패:', error);
    return [];
  }
};

/**
 * 로컬 스토리지에 북마크 저장
 *
 * @param bookmarks - 저장할 북마크 목록
 */
const saveBookmarksToStorage = (bookmarks: Bookmark[]): void => {
  if (!canUseStorage()) {
    return;
  }

  try {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } catch (error) {
    console.error('북마크 저장 실패:', error);
  }
};

/**
 * 로컬 스토리지에서 폴더 불러오기
 */
const loadFoldersFromStorage = (): BookshelfFolder[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const stored = localStorage.getItem('bookshelfFolders');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('폴더 로드 실패:', error);
    return [];
  }
};

/**
 * 로컬 스토리지에 폴더 저장
 *
 * @param folders - 저장할 폴더 목록
 */
const saveFoldersToStorage = (folders: BookshelfFolder[]): void => {
  if (!canUseStorage()) {
    return;
  }

  try {
    localStorage.setItem('bookshelfFolders', JSON.stringify(folders));
  } catch (error) {
    console.error('폴더 저장 실패:', error);
  }
};

/**
 * 북마크 Store 생성
 */
export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  // 초기 상태
  bookmarks: loadBookmarksFromStorage(),
  folders: loadFoldersFromStorage(),
  filters: {
    sortBy: BookmarkSortBy.RECENTLY_ADDED,
  },

  // Actions 구현
  addBookmark: (bookmark) => {
    const currentBookmarks = get().bookmarks;

    // 이미 북마크되어 있으면 무시
    if (currentBookmarks.some((b) => b.isbn === bookmark.isbn)) {
      return;
    }

    // 현재 시간을 addedAt으로 설정
    const newBookmark: Bookmark = {
      ...bookmark,
      addedAt: new Date().toISOString(),
    };

    const updatedBookmarks = [...currentBookmarks, newBookmark];
    saveBookmarksToStorage(updatedBookmarks);

    set({ bookmarks: updatedBookmarks });
  },

  removeBookmark: (isbn) => {
    const currentBookmarks = get().bookmarks;
    const updatedBookmarks = currentBookmarks.filter((b) => b.isbn !== isbn);

    saveBookmarksToStorage(updatedBookmarks);
    set({ bookmarks: updatedBookmarks });

    // 모든 폴더에서도 제거
    const currentFolders = get().folders;
    const updatedFolders = currentFolders.map((folder) => ({
      ...folder,
      bookIsbns: folder.bookIsbns.filter((bookIsbn) => bookIsbn !== isbn),
    }));

    saveFoldersToStorage(updatedFolders);
    set({ folders: updatedFolders });
  },

  updateBookmark: (isbn, updates) => {
    const currentBookmarks = get().bookmarks;
    const updatedBookmarks = currentBookmarks.map((b) =>
      b.isbn === isbn ? { ...b, ...updates } : b
    );

    saveBookmarksToStorage(updatedBookmarks);
    set({ bookmarks: updatedBookmarks });
  },

  isBookmarked: (isbn) => {
    return get().bookmarks.some((b) => b.isbn === isbn);
  },

  getBookmark: (isbn) => {
    return get().bookmarks.find((b) => b.isbn === isbn);
  },

  createFolder: (name, description, color) => {
    const newFolder: BookshelfFolder = {
      id: `folder_${Date.now()}`,
      name,
      description,
      bookIsbns: [],
      createdAt: new Date().toISOString(),
      color,
    };

    const currentFolders = get().folders;
    const updatedFolders = [...currentFolders, newFolder];

    saveFoldersToStorage(updatedFolders);
    set({ folders: updatedFolders });

    return newFolder.id;
  },

  deleteFolder: (folderId) => {
    const currentFolders = get().folders;
    const updatedFolders = currentFolders.filter((f) => f.id !== folderId);

    saveFoldersToStorage(updatedFolders);
    set({ folders: updatedFolders });
  },

  updateFolder: (folderId, updates) => {
    const currentFolders = get().folders;
    const updatedFolders = currentFolders.map((f) =>
      f.id === folderId ? { ...f, ...updates } : f
    );

    saveFoldersToStorage(updatedFolders);
    set({ folders: updatedFolders });
  },

  addBookToFolder: (folderId, isbn) => {
    const currentFolders = get().folders;
    const updatedFolders = currentFolders.map((f) => {
      if (f.id === folderId && !f.bookIsbns.includes(isbn)) {
        return {
          ...f,
          bookIsbns: [...f.bookIsbns, isbn],
        };
      }
      return f;
    });

    saveFoldersToStorage(updatedFolders);
    set({ folders: updatedFolders });
  },

  removeBookFromFolder: (folderId, isbn) => {
    const currentFolders = get().folders;
    const updatedFolders = currentFolders.map((f) => {
      if (f.id === folderId) {
        return {
          ...f,
          bookIsbns: f.bookIsbns.filter((bookIsbn) => bookIsbn !== isbn),
        };
      }
      return f;
    });

    saveFoldersToStorage(updatedFolders);
    set({ folders: updatedFolders });
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({
      filters: {
        sortBy: BookmarkSortBy.RECENTLY_ADDED,
      },
    });
  },

  getFilteredBookmarks: () => {
    const { bookmarks, filters, folders } = get();
    let filtered = [...bookmarks];

    // 읽음 상태 필터
    if (filters.readStatus) {
      filtered = filtered.filter((b) => b.readStatus === filters.readStatus);
    }

    // 태그 필터
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((b) =>
        b.tags?.some((tag) => filters.tags?.includes(tag))
      );
    }

    // 폴더 필터
    if (filters.folderId) {
      const folder = folders.find((f) => f.id === filters.folderId);
      if (folder) {
        filtered = filtered.filter((b) => folder.bookIsbns.includes(b.isbn));
      }
    }

    // 키워드 검색
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword) ||
          b.author.toLowerCase().includes(keyword) ||
          b.publisher.toLowerCase().includes(keyword)
      );
    }

    // 정렬
    switch (filters.sortBy) {
      case BookmarkSortBy.RECENTLY_ADDED:
        filtered.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
        break;
      case BookmarkSortBy.OLDEST_FIRST:
        filtered.sort(
          (a, b) =>
            new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        );
        break;
      case BookmarkSortBy.TITLE_ASC:
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        break;
      case BookmarkSortBy.AUTHOR_ASC:
        filtered.sort((a, b) => a.author.localeCompare(b.author, 'ko'));
        break;
      case BookmarkSortBy.RATING_DESC:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return filtered;
  },
}));
