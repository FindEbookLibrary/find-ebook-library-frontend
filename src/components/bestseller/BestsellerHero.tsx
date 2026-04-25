interface BestsellerHeroProps {
  myImmediateCount: number;
  myMatchPercentage: number;
  myMatchCount: number;
  totalMatchPercentage: number;
  totalMatchCount: number;
  totalBooks: number;
  topLibraryName: string | null;
  topLibraryCount: number;
  myLibraryCount: number;
}

function HeroMetric({
  big,
  suffix,
  label,
  sub,
  tone,
  isText = false,
}: {
  big: string;
  suffix?: string;
  label: string;
  sub?: string;
  tone: 'primary' | 'soft' | 'ghost';
  isText?: boolean;
}) {
  const toneClass = {
    primary: 'bg-white text-ink-900',
    soft: 'border border-white/15 bg-white/10 text-white backdrop-blur',
    ghost: 'border border-white/10 bg-white/5 text-white backdrop-blur',
  }[tone];

  return (
    <div className={`rounded-xl2 p-4 md:p-5 ${toneClass}`}>
      <div className="flex items-baseline gap-1">
        {isText ? (
          <span className="line-clamp-2 text-[15px] font-bold leading-tight tracking-tight md:text-[17px]">
            {big}
          </span>
        ) : (
          <>
            <span className="num text-[28px] font-bold leading-none tracking-tight md:text-[34px]">
              {big}
            </span>
            {suffix ? (
              <span className="text-[14px] font-medium opacity-80 md:text-[15px]">
                {suffix}
              </span>
            ) : null}
          </>
        )}
      </div>
      <div className={`mt-2 text-[12.5px] ${tone === 'primary' ? 'text-ink-700' : 'text-brand-100'}`}>
        {label}
      </div>
      {sub ? (
        <div className={`mt-1 text-[10.5px] ${tone === 'primary' ? 'text-ink-500' : 'text-brand-200'}`}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

export default function BestsellerHero({
  myImmediateCount,
  myMatchPercentage,
  myMatchCount,
  totalMatchPercentage,
  totalMatchCount,
  totalBooks,
  topLibraryName,
  topLibraryCount,
  myLibraryCount,
}: BestsellerHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-ink-200 bg-gradient-to-br from-brand-700 via-brand-700 to-brand-800 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0 14px, transparent 14px 32px)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.10), transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-12 sm:px-5 md:px-8 md:pb-14 md:pt-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-brand-100">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          BESTSELLER MATCH · 매주 월요일 갱신
        </div>
        <h1 className="max-w-[860px] text-[28px] font-bold leading-[1.1] tracking-tight md:text-[44px]">
          이번 주 베스트셀러,
          <br />
          <span className="text-brand-200">전자도서관에서 무료로</span> 읽을 수 있을까요?
        </h1>
        <p className="mt-4 max-w-[720px] text-[14px] leading-relaxed text-brand-100 md:text-[16px]">
          YES24·교보문고·알라딘 베스트셀러를 기준으로, 내가 이용 가능한 전자도서관의 보유 여부를 한 번에 매칭합니다.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <HeroMetric
            big={String(myImmediateCount)}
            suffix="권"
            label="내 도서관에서 즉시 대출"
            sub={`등록된 ${myLibraryCount}곳 기준`}
            tone="primary"
          />
          <HeroMetric
            big={String(myMatchPercentage)}
            suffix="%"
            label="내 도서관 보유율"
            sub={`${myMatchCount} / ${totalBooks}권`}
            tone="soft"
          />
          <HeroMetric
            big={String(totalMatchPercentage)}
            suffix="%"
            label="전체 보유율"
            sub={`${totalMatchCount} / ${totalBooks}권`}
            tone="soft"
          />
          <HeroMetric
            big={topLibraryName ?? '—'}
            label="가장 많이 보유한 도서관"
            sub={topLibraryName ? `${topLibraryCount}권 보유` : undefined}
            tone="ghost"
            isText
          />
        </div>
      </div>
    </div>
  );
}
