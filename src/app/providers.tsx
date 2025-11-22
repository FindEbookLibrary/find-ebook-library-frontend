/**
 * Providers 컴포넌트
 * 전역 Context Provider들을 모아놓은 컴포넌트
 *
 * 'use client' 지시어
 * - 이 컴포넌트는 Client Component입니다.
 * - 브라우저에서 실행되며, React 상태와 이벤트를 사용할 수 있습니다.
 * - Context API는 Client Component에서만 사용 가능합니다.
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Providers 컴포넌트
 *
 * @param children - 하위 컴포넌트
 *
 * 왜 Client Component인가?
 * - React Query의 QueryClientProvider는 Context를 사용합니다.
 * - Context는 Client Component에서만 사용 가능합니다.
 * - Zustand는 별도 Provider가 필요 없지만, 일관성을 위해 여기에 포함할 수 있습니다.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  /**
   * QueryClient 생성
   * useState를 사용하여 컴포넌트 생명주기 동안 하나의 인스턴스만 유지
   *
   * 왜 useState를 사용하는가?
   * - 컴포넌트가 리렌더링될 때마다 새 QueryClient를 생성하는 것을 방지
   * - useState의 초기화 함수는 컴포넌트 마운트 시 한 번만 실행됩니다.
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * staleTime: 데이터가 "신선한" 상태로 유지되는 시간
             * - 이 시간 동안은 재요청하지 않습니다.
             * - 0 = 항상 stale (기본값)
             * - 60 * 1000 = 1분
             */
            staleTime: 60 * 1000, // 1분

            /**
             * gcTime (이전 cacheTime): 캐시에 데이터를 보관하는 시간
             * - 사용되지 않는 데이터를 가비지 컬렉션하기 전까지의 시간
             */
            gcTime: 5 * 60 * 1000, // 5분

            /**
             * refetchOnWindowFocus: 윈도우 포커스 시 자동 재요청 여부
             * - true: 사용자가 다른 탭에서 돌아올 때 데이터 갱신
             * - false: 자동 갱신 안 함
             */
            refetchOnWindowFocus: false,

            /**
             * retry: 실패 시 재시도 횟수
             * - false: 재시도 안 함
             * - 숫자: 재시도 횟수
             */
            retry: 1,
          },
        },
      })
  );

  /**
   * QueryClientProvider로 앱을 감싸서
   * 모든 하위 컴포넌트에서 useQuery, useMutation 등을 사용할 수 있게 합니다.
   *
   * Spring의 ApplicationContext와 유사:
   * - Spring: Bean을 전역적으로 관리
   * - React Query: 서버 상태를 전역적으로 관리
   */
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
