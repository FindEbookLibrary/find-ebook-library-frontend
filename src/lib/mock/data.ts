import { BookStore, BestsellerBook, BestsellerLibraryMatch } from '@/types/bestseller.types';
import { AvailStatus, EBook, LibraryBookInfo } from '@/types/book.types';
import { Library, LibraryType, Platform } from '@/types/library.types';
import { AffiliationUIType } from '@/types/ui.types';

export const shouldUseMockData = (): boolean =>
  process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const PLATFORMS: Platform[] = [
  { id: 'kyobo', name: '교보문고 전자도서관', short: 'KYO', tone: '#2B3A8C' },
  { id: 'yes24', name: 'YES24 전자도서관', short: 'Y24', tone: '#3A8C6A' },
  { id: 'aladin', name: '알라딘 전자도서관', short: 'ALA', tone: '#B7791F' },
];

export const MOCK_LIBRARIES: Library[] = [
  {
    libCode: 'seoul-edu',
    libName: '서울시교육청 전자도서관',
    type: LibraryType.PUBLIC,
    region: '서울',
    platform: 'kyobo',
    authNeeded: false,
    lastSync: '2시간 전',
  },
  {
    libCode: 'gangnam',
    libName: '강남구 전자도서관',
    type: LibraryType.REGIONAL,
    region: '서울 강남구',
    platform: 'yes24',
    authNeeded: false,
    lastSync: '오늘 09:12',
  },
  {
    libCode: 'oo-univ',
    libName: 'OO대학교 중앙도서관',
    type: LibraryType.UNIVERSITY,
    region: '서울',
    platform: 'kyobo',
    authNeeded: false,
    lastSync: '어제',
  },
  {
    libCode: 'xx-corp',
    libName: 'XX기업 전자도서관',
    type: LibraryType.CORPORATE,
    region: '경기 성남',
    platform: 'yes24',
    authNeeded: true,
    lastSync: '미연동',
  },
  {
    libCode: 'gg-cyber',
    libName: '경기도사이버도서관',
    type: LibraryType.PUBLIC,
    region: '경기',
    platform: 'aladin',
    authNeeded: false,
    lastSync: '—',
  },
  {
    libCode: 'busan',
    libName: '부산광역시 전자도서관',
    type: LibraryType.PUBLIC,
    region: '부산',
    platform: 'kyobo',
    authNeeded: false,
    lastSync: '—',
  },
  {
    libCode: 'songpa',
    libName: '송파구립도서관',
    type: LibraryType.REGIONAL,
    region: '서울 송파구',
    platform: 'kyobo',
    authNeeded: false,
    lastSync: '—',
  },
  {
    libCode: 'kookmin',
    libName: '국민대학교 성곡도서관',
    type: LibraryType.UNIVERSITY,
    region: '서울',
    platform: 'aladin',
    authNeeded: true,
    lastSync: '—',
  },
  {
    libCode: 'incheon',
    libName: '인천광역시 전자도서관',
    type: LibraryType.PUBLIC,
    region: '인천',
    platform: 'yes24',
    authNeeded: false,
    lastSync: '—',
  },
  {
    libCode: 'mapo',
    libName: '마포구립도서관',
    type: LibraryType.REGIONAL,
    region: '서울 마포구',
    platform: 'aladin',
    authNeeded: false,
    lastSync: '—',
  },
];

type RawBook = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  category: string;
  description: string;
  toc: string[];
};

const RAW_BOOKS: RawBook[] = [
  {
    id: 'b1',
    title: '트렌드 코리아 2026',
    author: '김난도 외',
    publisher: '미래의창',
    year: 2025,
    isbn: '9788959898765',
    category: '경제/경영',
    description:
      '서울대 소비트렌드분석센터가 매년 발표하는 한국 사회의 트렌드 키워드 모음. 2026년 한 해를 관통할 10대 키워드를 정리했습니다.',
    toc: ['프롤로그 — 다시 그리는 한국', '01. 옴니보어 소비', '02. 페이스 테크', '03. 일상의 하이엔드화', '04. 그라데이션K'],
  },
  {
    id: 'b2',
    title: '불편한 편의점',
    author: '김호연',
    publisher: '나무옆의자',
    year: 2021,
    isbn: '9791161571188',
    category: '소설',
    description:
      '서울역 노숙인이 청파동 작은 편의점에서 야간 알바를 시작하며 벌어지는 따뜻한 이야기입니다.',
    toc: ['1. 산해진미', '2. ALWAYS', '3. 폐기 임박 삼각김밥', '4. 불편한 편의점', '5. 평화로운 편의점'],
  },
  {
    id: 'b3',
    title: '역행자',
    author: '자청',
    publisher: '웅진지식하우스',
    year: 2022,
    isbn: '9788901260532',
    category: '자기계발',
    description:
      '평범한 사람이 경제적 자유에 도달하기 위한 7단계 모델을 제시합니다.',
    toc: ['1단계 자의식 해체', '2단계 정체성 만들기', '3단계 유전자 오작동', '4단계 뇌 자동화'],
  },
  {
    id: 'b4',
    title: '세이노의 가르침',
    author: '세이노(SayNo)',
    publisher: '데이드림',
    year: 2023,
    isbn: '9791168473690',
    category: '자기계발',
    description:
      '20년간 인터넷에 흩어져 있던 세이노의 글을 정리한 인생/돈/일에 대한 직설적 가르침입니다.',
    toc: ['시작하는 글', '돈에 대한 태도', '일에 대한 태도', '삶에 대한 태도'],
  },
  {
    id: 'b5',
    title: '아몬드',
    author: '손원평',
    publisher: '창비',
    year: 2017,
    isbn: '9788936434267',
    category: '소설',
    description:
      '감정을 느끼지 못하는 소년 윤재가 세상과 부딪히며 성장하는 이야기입니다.',
    toc: ['프롤로그', '1부', '2부', '3부', '에필로그'],
  },
  {
    id: 'b6',
    title: '자바의 정석',
    author: '남궁성',
    publisher: '도우출판',
    year: 2016,
    isbn: '9788994492032',
    category: 'IT/컴퓨터',
    description:
      '국내 자바 입문서의 스테디셀러로 객체지향, 컬렉션, 람다, 스트림, 멀티스레드까지 폭넓게 다룹니다.',
    toc: ['1장 자바를 시작하기 전에', '2장 변수', '3장 연산자', '14장 람다와 스트림'],
  },
  {
    id: 'b7',
    title: '클린 코드',
    author: 'Robert C. Martin',
    publisher: '인사이트',
    year: 2013,
    isbn: '9788966260959',
    category: 'IT/컴퓨터',
    description:
      '읽기 쉽고 유지보수 가능한 코드를 작성하는 원칙을 사례 기반으로 설명한 소프트웨어 공학 고전입니다.',
    toc: ['1장 깨끗한 코드', '2장 의미 있는 이름', '3장 함수', '4장 주석'],
  },
  {
    id: 'b8',
    title: '돈의 심리학',
    author: '모건 하우절',
    publisher: '인플루엔셜',
    year: 2021,
    isbn: '9791191056556',
    category: '경제/경영',
    description:
      '부와 욕망, 행복에 관한 짧은 19가지 이야기로 투자보다 행동이 중요하다는 메시지를 전합니다.',
    toc: ['1장 아무도 미치지 않았다', '2장 운과 리스크', '3장 결코 충분하지 않다', '4장 복리의 힘'],
  },
];

const createAvailabilityMatrix = (): Record<string, Record<string, AvailStatus>> => {
  const matrix: Record<string, Record<string, AvailStatus>> = {};

  RAW_BOOKS.forEach((book, bookIndex) => {
    matrix[book.id] = {};

    MOCK_LIBRARIES.forEach((library, libraryIndex) => {
      const score = (bookIndex * 7 + libraryIndex * 3 + bookIndex * libraryIndex) % 11;
      let status: AvailStatus = 'none';

      if (score < 4) {
        status = 'available';
      } else if (score < 6) {
        status = 'reserve';
      } else if (score < 8) {
        status = 'held';
      }

      if (book.id === 'b1' && libraryIndex < 5) {
        status = ['available', 'available', 'reserve', 'held', 'available'][libraryIndex] as AvailStatus;
      }

      if (book.id === 'b2' && libraryIndex < 6) {
        status = ['available', 'reserve', 'available', 'held', 'available', 'reserve'][libraryIndex] as AvailStatus;
      }

      matrix[book.id][library.libCode] = status;
    });
  });

  return matrix;
};

export const AVAILABILITY_MATRIX = createAvailabilityMatrix();

const makeLibraryEntries = (bookId: string): LibraryBookInfo[] =>
  MOCK_LIBRARIES.flatMap((library) => {
    const status = AVAILABILITY_MATRIX[bookId]?.[library.libCode] ?? 'none';

    if (status === 'none') {
      return [];
    }

    return [
      {
        libCode: library.libCode,
        libName: library.libName,
        isAvailable: status === 'available',
        status,
        detailUrl: '#',
        availableCopies: status === 'available' ? 1 : 0,
        totalCopies: 1,
        waitingCount: status === 'reserve' ? 3 : 0,
      },
    ];
  });

export const MOCK_BOOKS: EBook[] = RAW_BOOKS.map((book) => ({
  id: book.id,
  isbn: book.isbn,
  title: book.title,
  author: book.author,
  publisher: book.publisher,
  publicationYear: String(book.year),
  category: book.category,
  description: book.description,
  toc: book.toc,
  availableLibraries: makeLibraryEntries(book.id),
}));

export const POPULAR_KEYWORDS = [
  '트렌드 코리아',
  '불편한 편의점',
  '역행자',
  '세이노의 가르침',
  '자바의 정석',
  '아몬드',
  '돈의 심리학',
];

export const BESTSELLER_CATEGORIES = ['종합', '소설', '경제/경영', '자기계발', '인문', 'IT/컴퓨터'] as const;

export const BESTSELLER_RANK: Record<string, string[]> = {
  [`${BookStore.YES24}:종합`]: ['b1', 'b2', 'b3', 'b4', 'b8', 'b5', 'b7', 'b6'],
  [`${BookStore.YES24}:소설`]: ['b2', 'b5', 'b1', 'b3', 'b4', 'b8', 'b6', 'b7'],
  [`${BookStore.YES24}:경제/경영`]: ['b1', 'b8', 'b3', 'b4', 'b2', 'b5', 'b7', 'b6'],
  [`${BookStore.YES24}:자기계발`]: ['b3', 'b4', 'b1', 'b8', 'b2', 'b5', 'b6', 'b7'],
  [`${BookStore.YES24}:인문`]: ['b1', 'b5', 'b2', 'b8', 'b3', 'b4', 'b7', 'b6'],
  [`${BookStore.YES24}:IT/컴퓨터`]: ['b7', 'b6', 'b1', 'b3', 'b8', 'b2', 'b5', 'b4'],
  [`${BookStore.KYOBO}:종합`]: ['b2', 'b1', 'b4', 'b3', 'b5', 'b8', 'b7', 'b6'],
  [`${BookStore.KYOBO}:소설`]: ['b5', 'b2', 'b1', 'b4', 'b3', 'b8', 'b6', 'b7'],
  [`${BookStore.KYOBO}:경제/경영`]: ['b8', 'b1', 'b3', 'b4', 'b2', 'b5', 'b7', 'b6'],
  [`${BookStore.KYOBO}:자기계발`]: ['b4', 'b3', 'b1', 'b8', 'b2', 'b5', 'b6', 'b7'],
  [`${BookStore.KYOBO}:인문`]: ['b5', 'b1', 'b2', 'b8', 'b3', 'b4', 'b7', 'b6'],
  [`${BookStore.KYOBO}:IT/컴퓨터`]: ['b6', 'b7', 'b1', 'b3', 'b8', 'b2', 'b5', 'b4'],
  [`${BookStore.ALADIN}:종합`]: ['b3', 'b1', 'b2', 'b8', 'b4', 'b7', 'b6', 'b5'],
  [`${BookStore.ALADIN}:소설`]: ['b2', 'b5', 'b1', 'b3', 'b4', 'b8', 'b7', 'b6'],
  [`${BookStore.ALADIN}:경제/경영`]: ['b1', 'b3', 'b8', 'b4', 'b2', 'b5', 'b7', 'b6'],
  [`${BookStore.ALADIN}:자기계발`]: ['b3', 'b4', 'b8', 'b1', 'b2', 'b5', 'b6', 'b7'],
  [`${BookStore.ALADIN}:인문`]: ['b1', 'b5', 'b8', 'b2', 'b3', 'b4', 'b7', 'b6'],
  [`${BookStore.ALADIN}:IT/컴퓨터`]: ['b7', 'b6', 'b3', 'b1', 'b8', 'b2', 'b5', 'b4'],
};

export const DEFAULT_AFFILIATION_TYPE: AffiliationUIType = 'university';
export const DEFAULT_INTEREST_LIBRARY_CODES = ['oo-univ', 'seoul-edu', 'gangnam'];

const bookByIdMap = new Map(MOCK_BOOKS.map((book) => [book.id, book]));
const bookByIsbnMap = new Map(MOCK_BOOKS.map((book) => [book.isbn, book]));
const libraryByCodeMap = new Map(MOCK_LIBRARIES.map((library) => [library.libCode, library]));
const platformByIdMap = new Map(PLATFORMS.map((platform) => [platform.id, platform]));

export const getMockBookById = (id?: string): EBook | undefined =>
  (id ? bookByIdMap.get(id) : undefined);

export const getMockBookByIsbn = (isbn: string): EBook | undefined =>
  bookByIsbnMap.get(isbn);

export const getMockLibraryByCode = (libCode: string): Library | undefined =>
  libraryByCodeMap.get(libCode);

export const getMockPlatformById = (platformId?: string): Platform | undefined =>
  (platformId ? platformByIdMap.get(platformId) : undefined);

export const getMockSearchResults = (query: string): EBook[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return MOCK_BOOKS;
  }

  return MOCK_BOOKS.filter((book) =>
    [book.title, book.author, book.category, book.isbn]
      .filter(Boolean)
      .some((field) => field?.toLowerCase().includes(normalizedQuery))
  );
};

const toBestsellerLibraryMatches = (
  availableLibraries: LibraryBookInfo[] = []
): BestsellerLibraryMatch[] =>
  availableLibraries.map((library) => ({
    libCode: library.libCode,
    libName: library.libName,
    hasEBook: true,
    isAvailable: library.isAvailable,
    detailUrl: library.detailUrl,
    reservationCount: library.waitingCount,
  }));

export const getMockBestsellers = (
  store: BookStore,
  category: string
): BestsellerBook[] => {
  const ids = BESTSELLER_RANK[`${store}:${category}`] ?? BESTSELLER_RANK[`${store}:종합`] ?? [];
  const books: BestsellerBook[] = [];

  ids.forEach((id, index) => {
    const book = getMockBookById(id);

    if (book) {
      books.push({
        rank: index + 1,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        libraryAvailability: toBestsellerLibraryMatches(book.availableLibraries),
      });
    }
  });

  return books;
};
