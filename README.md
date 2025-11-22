# 전자도서관 통합 검색 서비스 (프론트엔드)

여러 전자도서관의 전자책을 한 번에 검색하고, 베스트셀러가 어떤 도서관에 있는지 확인할 수 있는 웹 서비스입니다.

## 📋 주요 기능

- 🔍 **전자도서관 통합 검색**: 여러 전자도서관의 전자책 데이터를 한 번에 검색
- 🧭 **사용 가능 도서관 필터링**: 사용자의 소속(대학교, 회사, 시·군 등)에 따라 접근 가능한 도서관만 표시
- 📚 **베스트셀러 매칭 기능**: YES24, 교보문고, 알라딘 등 주요 서점의 베스트셀러가 어떤 전자도서관에 있는지 확인

## 🛠️ 기술 스택

### 프레임워크 및 라이브러리
- **Next.js 15**: React 기반 풀스택 프레임워크 (App Router)
- **React 19**: 최신 React 버전
- **TypeScript 5.7**: 타입 안전성을 위한 JavaScript의 상위 집합

### 상태 관리
- **Zustand 5**: 간단하고 직관적인 전역 상태 관리 라이브러리
- **TanStack Query v5** (React Query): 서버 상태 관리 및 데이터 페칭

### HTTP 클라이언트
- **Axios**: Promise 기반 HTTP 클라이언트

### 스타일링
- **CSS Modules**: 컴포넌트별 스타일 격리

## 📁 프로젝트 구조

```
find-ebook-library-frontend/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   │   ├── layout.tsx       # 루트 레이아웃 (공통 레이아웃)
│   │   ├── page.tsx         # 홈 페이지 (/)
│   │   ├── page.module.css  # 홈 페이지 스타일
│   │   ├── providers.tsx    # React Query Provider
│   │   ├── globals.css      # 전역 스타일
│   │   ├── search/          # 검색 페이지 (/search)
│   │   │   ├── page.tsx
│   │   │   └── page.module.css
│   │   └── bestseller/      # 베스트셀러 페이지 (/bestseller)
│   │       ├── page.tsx
│   │       └── page.module.css
│   ├── components/          # React 컴포넌트 (Client Components)
│   │   ├── common/          # 공통 컴포넌트
│   │   │   ├── Navbar.tsx   # 네비게이션 바
│   │   │   └── Navbar.module.css
│   │   ├── search/          # 검색 관련 컴포넌트
│   │   ├── bestseller/      # 베스트셀러 관련 컴포넌트
│   │   └── library/         # 도서관 관련 컴포넌트
│   ├── lib/                 # 라이브러리 및 유틸리티
│   │   └── services/        # API 서비스 레이어
│   │       ├── api.config.ts    # Axios 설정 및 인터셉터
│   │       ├── library.service.ts # 도서관 API 서비스
│   │       ├── book.service.ts   # 전자책 API 서비스
│   │       └── bestseller.service.ts # 베스트셀러 API 서비스
│   ├── stores/              # Zustand 상태 관리 스토어
│   │   ├── userStore.ts     # 사용자 상태 관리
│   │   ├── searchStore.ts   # 검색 상태 관리
│   │   └── bestsellerStore.ts # 베스트셀러 상태 관리
│   ├── hooks/               # 커스텀 React 훅
│   │   ├── useBookSearch.ts # 전자책 검색 훅
│   │   ├── useBestseller.ts # 베스트셀러 훅
│   │   └── useAuth.ts       # 인증 훅
│   └── types/               # TypeScript 타입 정의
│       ├── library.types.ts # 도서관 관련 타입
│       ├── book.types.ts    # 전자책 관련 타입
│       ├── bestseller.types.ts # 베스트셀러 관련 타입
│       └── user.types.ts    # 사용자 관련 타입
├── public/                  # 정적 파일 (favicon, 이미지 등)
├── package.json             # 프로젝트 의존성 및 스크립트
├── tsconfig.json            # TypeScript 설정
├── next.config.ts           # Next.js 설정
├── .env.example             # 환경 변수 예제
└── README.md                # 프로젝트 문서
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn 패키지 매니저

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd find-ebook-library-frontend
```

2. 의존성 패키지 설치
```bash
npm install
# 또는
yarn install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 실제 값을 입력하세요:
```env
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_LIBRARY_API_KEY=your_library_api_key_here
```

> **환경 변수 규칙**: Next.js에서 `NEXT_PUBLIC_` 접두사가 있는 변수만 브라우저에서 접근 가능합니다.

> **도서관 정보나루 API 키 발급**: [http://data4library.kr](http://data4library.kr)에서 회원가입 후 API 키를 발급받으세요.

4. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

> **Turbopack 개발 서버 사용**: Next.js 15는 기본적으로 Turbopack을 사용하여 개발 서버를 실행합니다. Webpack보다 700배 빠른 성능을 제공합니다!

## 📜 주요 스크립트

```bash
# 개발 서버 시작 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# TypeScript 타입 체크
npm run type-check

# 린트 검사 (Next.js ESLint)
npm run lint
```

## 🏗️ 아키텍처 설명

### 레이어드 아키텍처

이 프로젝트는 레이어드 아키텍처 패턴을 따릅니다:

1. **Presentation Layer (페이지/컴포넌트)**
   - 사용자 인터페이스 렌더링
   - 사용자 입력 처리
   - 예: `HomePage.tsx`, `SearchPage.tsx`

2. **Business Logic Layer (커스텀 훅)**
   - 비즈니스 로직 처리
   - 상태 관리와 API 호출 연결
   - 예: `useBookSearch.ts`, `useBestseller.ts`

3. **Data Access Layer (서비스)**
   - API 통신
   - 데이터 변환 및 에러 처리
   - 예: `book.service.ts`, `library.service.ts`

4. **State Management (스토어)**
   - 전역 상태 관리
   - 로컬 스토리지 동기화
   - 예: `userStore.ts`, `searchStore.ts`

### 주요 패턴 및 개념

#### 1. 커스텀 훅 (Custom Hooks)
React의 상태 관리 로직을 재사용 가능한 함수로 분리합니다.

```typescript
// useBookSearch.ts 예시
export const useBookSearch = () => {
  const { keyword, results, setResults } = useSearchStore();

  const search = async (params: BookSearchParams) => {
    const response = await bookService.searchBooks(params);
    setResults(response.books, response.totalResults);
  };

  return { keyword, results, search };
};
```

#### 2. 서비스 레이어 (Service Layer)
API 통신을 담당하는 싱글톤 클래스입니다.

```typescript
// book.service.ts 예시
class BookService {
  async searchBooks(params: BookSearchParams) {
    const response = await apiClient.post('/books/search', params);
    return response.data;
  }
}

export const bookService = new BookService();
```

#### 3. Zustand 스토어 (State Store)
전역 상태를 관리합니다.

```typescript
// searchStore.ts 예시
export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  results: [],
  setResults: (results, totalResults) => set({ results, totalResults }),
}));
```

#### 4. TypeScript 타입 정의
모든 데이터 구조를 명확하게 정의합니다.

```typescript
// book.types.ts 예시
export interface EBook {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
}
```

## 🔑 핵심 개념 (백엔드 개발자를 위한 설명)

### Next.js 15의 Server Components와 Client Components

**Server Components (서버 컴포넌트) - 기본값**
- 서버에서만 실행됩니다 (브라우저로 전송되지 않음)
- 데이터베이스나 파일 시스템에 직접 접근 가능
- 환경 변수를 안전하게 사용 가능 (API 키 등)
- JavaScript 번들 크기가 작아집니다
- 예: `layout.tsx`, API 호출이 포함된 페이지

**Client Components (클라이언트 컴포넌트) - 'use client' 필요**
- 브라우저에서 실행됩니다
- 상태(useState), 이벤트 핸들러, useEffect 등 사용 가능
- 상호작용이 필요한 UI에 사용
- 예: `'use client'` 지시어가 있는 컴포넌트

```typescript
// Server Component (기본)
export default function ServerPage() {
  // 서버에서 데이터 페칭 가능
  const data = await fetch('...');
  return <div>{data}</div>;
}

// Client Component
'use client';
export default function ClientButton() {
  const [count, setCount] = useState(0);  // useState 사용
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### App Router (Next.js 15)
- **Spring MVC의 @RequestMapping과 유사한 파일 기반 라우팅**
- `app/page.tsx` → `/`
- `app/search/page.tsx` → `/search`
- `app/bestseller/page.tsx` → `/bestseller`
- `layout.tsx`: 공통 레이아웃 (모든 페이지에 적용)

### 상태 관리 (State Management)
- **Zustand**: Spring의 Bean 관리와 유사한 전역 상태 관리
- **TanStack Query**: 서버 상태 관리 (캐싱, 재시도, 무효화 등)
- **useState**: 컴포넌트 내부의 로컬 상태
- **useEffect**: 컴포넌트 생명주기 관리 (Spring의 @PostConstruct와 유사)

### HTTP 통신
- **Axios**: Spring의 RestTemplate과 유사한 HTTP 클라이언트
- **Interceptor**: Spring의 Filter/Interceptor와 동일한 개념으로 요청/응답 가로채기
- **Next.js API Routes**: 선택적으로 백엔드 API를 Next.js 내부에 구현 가능

### 이미지 최적화
- **Next.js Image 컴포넌트**: 자동 이미지 최적화, lazy loading, WebP 변환
- **Spring의 정적 리소스 제공과 유사하지만 자동으로 최적화**

## 🎨 스타일링

- **CSS Modules**: 컴포넌트별 스타일 격리
- **CSS 변수**: 재사용 가능한 스타일 값 정의
- **반응형 디자인**: 다양한 화면 크기 지원

## 🔐 보안

- **환경 변수**: 민감한 정보는 `.env` 파일에 저장
- **JWT 토큰**: 로컬 스토리지에 저장하여 인증 유지
- **CORS**: Vite 프록시 설정으로 개발 환경에서 해결

## 📝 코드 주석 규칙

모든 코드에는 백엔드 개발자가 이해할 수 있도록 상세한 주석이 달려있습니다:

- **파일 상단**: 파일의 목적과 역할 설명
- **함수/메서드**: 파라미터, 반환값, 사용 예시 포함
- **복잡한 로직**: 단계별 설명 추가
- **TypeScript 타입**: 각 속성의 의미 설명

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ by 전자도서관 통합 검색 팀**