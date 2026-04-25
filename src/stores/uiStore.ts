import { create } from 'zustand';
import { EBook } from '@/types/book.types';

interface UIState {
  openBook: EBook | null;
  setOpenBook: (book: EBook | null) => void;
}

/**
 * 페이지 간에 상세 모달을 공통으로 띄우기 위한 store입니다.
 * route는 그대로 두고, "현재 열린 책"만 전역 상태로 들고 있으면 레이아웃에서 모달을 렌더링할 수 있습니다.
 */
export const useUIStore = create<UIState>((set) => ({
  openBook: null,
  setOpenBook: (book) => set({ openBook: book }),
}));
