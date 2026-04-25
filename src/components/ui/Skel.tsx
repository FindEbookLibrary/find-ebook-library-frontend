interface SkelProps {
  className?: string;
}

export default function Skel({ className = '' }: SkelProps) {
  return <div className={`animate-pulse rounded bg-ink-100 ${className}`} />;
}
