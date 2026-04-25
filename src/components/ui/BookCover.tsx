import { EBook } from '@/types/book.types';

interface BookCoverProps {
  book: EBook;
  w?: number;
  h?: number;
  withSpine?: boolean;
}

const COVER_TONES: Record<string, { background: string; accent: string }> = {
  소설: { background: '#EAE3D6', accent: '#8C6E3B' },
  '경제/경영': { background: '#DDE3EE', accent: '#2B3A8C' },
  자기계발: { background: '#E3EBE0', accent: '#3A6E4A' },
  인문: { background: '#EAE0E2', accent: '#8C3A4A' },
  'IT/컴퓨터': { background: '#DDE6EA', accent: '#2B6E8C' },
};

export default function BookCover({
  book,
  w = 64,
  h = 92,
  withSpine = true,
}: BookCoverProps) {
  const tone = COVER_TONES[book.category ?? ''] ?? {
    background: '#E3E6EE',
    accent: '#3A3F4B',
  };

  const titleFontSize = Math.max(8, Math.min(11, w / 7));
  const metaFontSize = Math.max(6, w / 12);

  return (
    <div className="relative shrink-0 select-none" style={{ width: w, height: h }}>
      <div
        className="absolute inset-0 overflow-hidden rounded-[3px]"
        style={{
          background: tone.background,
          boxShadow: '0 1px 0 rgba(20,24,40,0.06), 0 6px 14px rgba(20,24,40,0.10)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, ${tone.accent}1A 0 6px, ${tone.accent}08 6px 14px)`,
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: tone.accent }} />
        {withSpine ? (
          <div
            className="absolute inset-y-0 left-0 w-[3px]"
            style={{ background: tone.accent, opacity: 0.45 }}
          />
        ) : null}
        <div className="absolute inset-0 flex flex-col justify-end p-1.5">
          <div
            className="font-bold leading-tight"
            style={{
              color: tone.accent,
              fontSize: titleFontSize,
              textShadow: '0 1px 0 rgba(255,255,255,0.4)',
              wordBreak: 'keep-all',
            }}
          >
            {book.title}
          </div>
          <div
            className="mono mt-0.5 opacity-70"
            style={{ color: tone.accent, fontSize: metaFontSize }}
          >
            {book.author}
          </div>
        </div>
      </div>
    </div>
  );
}
