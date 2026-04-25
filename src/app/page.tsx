'use client';

import { startTransition, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Chip, IconArrowRight, IconSearch, SectionTitle } from '@components/ui';
import { bookService } from '@lib/services/book.service';

const HERO_STATS = [
  { num: '2,418', label: '연동 전자도서관' },
  { num: '1.2M+', label: '검색 가능한 전자책' },
  { num: '3', label: '주요 전자책 플랫폼' },
];

const FEATURES = [
  {
    tag: '01',
    title: '전자도서관 통합 검색',
    desc: '여러 전자도서관의 전자책 보유 여부와 대출 상태를 한 화면에서 확인합니다.',
    bullets: ['교보·YES24·알라딘 중심 UI', '실시간 대출 상태', '플랫폼별 바로가기'],
  },
  {
    tag: '02',
    title: '내 소속 기반 필터링',
    desc: '대학·회사·지역·공공도서관 회원 정보를 기준으로 실제 이용 가능 도서관을 우선 표시합니다.',
    bullets: ['소속 유형 저장', '내 도서관 우선 정렬', '다중 도서관 선택'],
  },
  {
    tag: '03',
    title: '베스트셀러 매칭',
    desc: 'YES24·교보문고·알라딘 베스트셀러가 어느 전자도서관에 있는지 한눈에 보여줍니다.',
    bullets: ['주간/카테고리 기준', '보유율 요약', '내 도서관 보유 여부'],
  },
];

export default function HomePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('트렌드 코리아 2026');
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);

  useEffect(() => {
    const loadPopularKeywords = async () => {
      const keywords = await bookService.getPopularKeywords(7);
      setPopularKeywords(keywords);
    };

    void loadPopularKeywords();
  }, []);

  const submitSearch = (keyword?: string) => {
    const nextKeyword = (keyword ?? inputValue).trim();

    if (!nextKeyword) {
      return;
    }

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(nextKeyword)}`);
    });
  };

  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(43,58,140,0.18), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-[1180px] px-5 pb-24 pt-20 md:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11.5px] text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            v1.0 · 2,418개 도서관 연동
          </div>
          <h1 className="max-w-[860px] text-[40px] font-bold leading-[1.08] tracking-tight text-ink-900 md:text-[56px]">
            찾고 싶은 전자책,
            <br />
            <span className="text-brand-600">어느 도서관에 있는지</span> 한 번에 확인하세요.
          </h1>
          <p className="mt-5 max-w-[680px] text-[16px] leading-relaxed text-ink-600 md:text-[17px]">
            대학교, 회사, 지역 도서관의 전자책 보유 여부와 대출 가능 상태를 통합 검색합니다.
            소속 정보를 등록하면 실제 이용 가능한 도서관만 골라서 보여드립니다.
          </p>

          <div className="mt-8 max-w-[760px]">
            <div className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-card">
              <div className="pl-3 text-ink-500">
                <IconSearch size={20} />
              </div>
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    submitSearch();
                  }
                }}
                placeholder="책 제목, 저자, ISBN, 키워드로 검색"
                className="h-12 flex-1 bg-transparent px-2 text-[16px] outline-none placeholder:text-ink-400"
              />
              <Button size="lg" onClick={() => submitSearch()} className="!h-12 !rounded-xl">
                검색
                <IconArrowRight size={16} />
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[12.5px] text-ink-500">인기 검색</span>
              {popularKeywords.map((keyword) => (
                <Chip key={keyword} onClick={() => submitSearch(keyword)}>
                  {keyword}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-12 grid max-w-[640px] grid-cols-3 gap-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="num text-[24px] font-bold text-ink-900 md:text-[28px]">
                  {stat.num}
                </div>
                <div className="mt-1 text-[12.5px] text-ink-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 md:px-8">
        <SectionTitle
          eyebrow="What LibMatch does"
          title="흩어진 전자도서관, 하나의 검색창에서"
          sub="공공·대학·기업 전자도서관과 주요 전자책 플랫폼을 한 데 모았습니다."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.tag}
              className="group rounded-xl2 border border-ink-200 bg-white p-6 transition-shadow hover:shadow-cardHover"
            >
              <div className="flex items-center justify-between">
                <div className="mono text-[11px] tracking-wider text-brand-600">
                  FEATURE / {feature.tag}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <IconArrowRight size={16} />
                </div>
              </div>
              <h3 className="mt-5 text-[17px] font-bold tracking-tight text-ink-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                {feature.desc}
              </p>
              <ul className="mt-5 space-y-1.5">
                {feature.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-[12.5px] text-ink-700"
                  >
                    <span className="mt-1 h-1 w-1 rounded-full bg-brand-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-24 md:px-8">
        <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-brand-700 p-8 text-white md:flex-row md:items-center md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 12px, transparent 12px 28px)',
            }}
          />
          <div className="relative">
            <div className="mono mb-2 text-[11px] tracking-wider text-brand-200">
              START HERE
            </div>
            <h3 className="text-[22px] font-bold tracking-tight md:text-[26px]">
              내 소속 도서관을 등록하면, 검색이 더 정확해집니다.
            </h3>
            <p className="mt-2 max-w-[620px] text-[13.5px] text-brand-100">
              대학·회사·지역 도서관을 한 번 등록해두면, 검색 결과에 “내가 이용 가능한 도서관”이 먼저 표시됩니다.
            </p>
          </div>
          <div className="relative flex gap-2">
            <Link
              href="/library"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white bg-white px-5 text-[14.5px] font-medium text-brand-800"
            >
              내 도서관 설정
              <IconArrowRight size={16} />
            </Link>
            <Link
              href="/bestseller"
              className="inline-flex h-12 items-center rounded-xl px-5 text-[14.5px] font-medium text-white hover:bg-brand-600/40"
            >
              베스트셀러 매칭 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
