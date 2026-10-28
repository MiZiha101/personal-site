import type { ReactNode } from 'react';

export function SectionHeading({
  index,
  label,
  title,
  desc,
}: {
  index: string;
  label: string;
  title: ReactNode;
  desc?: string;
}) {
  return (
    <header className="reveal">
      <div className="flex items-center gap-4">
        <span className="font-serif text-sm italic" style={{ color: 'var(--accent)' }}>
          {index}
        </span>
        <span className="h-px w-10" style={{ background: 'var(--line-strong)' }} aria-hidden="true" />
        <span className="eyebrow">{label}</span>
      </div>

      <h2 className="display mt-5 text-3xl leading-snug md:text-[2.6rem]">{title}</h2>

      {desc ? (
        <p className="mt-4 max-w-prose text-[15px] leading-8" style={{ color: 'var(--muted)' }}>
          {desc}
        </p>
      ) : null}
    </header>
  );
}

export function SectionDivider() {
  return (
    <div className="mx-auto max-w-content px-6">
      <div className="hairline" />
    </div>
  );
}
