import Link from 'next/link';

import { IconArrowRight, IconChevDown } from '@components/ui';

const STEPS = [
  {
    id: '01',
    title: '내 소속 도서관 등록',
    description:
      '대학·회사·지역·공공도서관을 한 번 등록하면 검색 결과가 내 기준으로 필터링됩니다.',
    href: '/library',
    cta: '내 도서관 설정',
  },
  {
    id: '02',
    title: '책 검색',
    description:
      '제목·저자·ISBN·키워드로 검색하면 여러 전자도서관의 보유/대출 상태를 한 번에 보여드립니다.',
    href: '/',
    cta: '바로 검색',
  },
  {
    id: '03',
    title: '베스트셀러 매칭',
    description:
      'YES24·교보문고·알라딘 베스트셀러가 어느 전자도서관에 있는지 확인하세요.',
    href: '/bestseller',
    cta: '베스트셀러 매칭',
  },
];

const FAQS = [
  {
    question: 'LibMatch는 책을 직접 빌려주나요?',
    answer:
      '아니요. LibMatch는 보유/대출 상태를 안내하고, 실제 대출은 각 전자도서관 플랫폼으로 연결하는 UI입니다.',
  },
  {
    question: '소속 인증은 어떻게 하나요?',
    answer:
      '대학교·회사 도서관은 해당 기관 SSO, 공공도서관은 회원증 또는 지역 인증 흐름을 가정한 UX로 설계했습니다.',
  },
  {
    question: '데이터는 얼마나 자주 갱신되나요?',
    answer:
      '프로토타입 기준으로 도서관별 보유 정보는 주기적으로 동기화되고, 대출 상태는 실시간에 가깝게 반영되는 흐름을 표현합니다.',
  },
  {
    question: '베스트셀러 순위 기준은 무엇인가요?',
    answer:
      '서점별 공식 주간 베스트셀러를 기준으로 매주 월요일 갱신되는 흐름을 기준으로 디자인했습니다.',
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-[1080px] px-5 py-12 md:px-8">
      <div className="mono mb-2 text-[11px] tracking-wider text-brand-600">USER GUIDE</div>
      <h1 className="text-[30px] font-bold tracking-tight text-ink-900">
        3분이면 LibMatch에 익숙해집니다.
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.id} className="rounded-xl2 border border-ink-200 bg-white p-6">
            <div className="num text-[28px] font-bold text-brand-600">{step.id}</div>
            <h3 className="mt-3 font-bold text-ink-900">{step.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
              {step.description}
            </p>
            <Link
              href={step.href}
              className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700 hover:text-brand-800"
            >
              {step.cta}
              <IconArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-12 text-[18px] font-bold text-ink-900">자주 묻는 질문</h2>
      <div className="divide-y divide-ink-100 rounded-xl2 border border-ink-200 bg-white">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group p-5">
            <summary className="flex list-none items-center justify-between cursor-pointer">
              <span className="text-[14px] font-medium text-ink-900">{faq.question}</span>
              <span className="text-ink-500 transition-transform group-open:rotate-180">
                <IconChevDown size={16} />
              </span>
            </summary>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
