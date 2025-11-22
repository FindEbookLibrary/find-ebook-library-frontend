/**
 * Navbar 컴포넌트
 * 상단 네비게이션 바
 *
 * Client Component
 * - 'use client' 지시어 필요
 * - Link 컴포넌트와 상태를 사용하기 때문
 */

'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import styles from './Navbar.module.css';

/**
 * Navbar 컴포넌트
 *
 * Next.js의 Link 컴포넌트:
 * - <a> 태그 대신 사용
 * - 클라이언트 사이드 네비게이션 (페이지 새로고침 없음)
 * - 프리페칭 (사용자가 링크를 보면 미리 로드)
 */
export default function Navbar() {
  // Zustand store에서 사용자 정보 가져오기
  const { user } = useUserStore();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* 로고 */}
        <div className={styles.navbarLogo}>
          <Link href="/">전자도서관 통합 검색</Link>
        </div>

        {/* 메뉴 */}
        <ul className={styles.navbarMenu}>
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>
            <Link href="/search">검색</Link>
          </li>
          <li>
            <Link href="/bestseller">베스트셀러</Link>
          </li>
        </ul>

        {/* 사용자 정보 */}
        <div className={styles.navbarUser}>
          {user ? (
            <div className={styles.userInfo}>
              <span>환영합니다, {user.name}님</span>
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
