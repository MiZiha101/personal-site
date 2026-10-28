import { useSiteData } from '../store/siteData';
import { SectionHeading } from './ui/SectionHeading';

export function About() {
  const { data } = useSiteData();
  const { profile } = data;

  return (
    <section id="about" className="section">
      <SectionHeading
        index="01"
        label="About"
        title="在课堂和代码之间，找一个自己的方向"
        desc="不喜欢只停留在概念上，更愿意先做出一个能跑的东西，再回头把原理补上。"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="reveal space-y-5 text-[15px] leading-8" style={{ color: 'var(--ink-soft)' }}>
          {profile.bio.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
          ))}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {profile.campus.map((item) => (
              <div key={item.id} className="card p-5">
                <p className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                  {item.title}
                </p>
                <p className="mt-2 text-[12.5px] leading-7" style={{ color: 'var(--muted)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <p className="eyebrow">时间线</p>
          <ol className="mt-6">
            {profile.timeline.map((item, index) => (
              <li
                key={item.id}
                className="relative pb-7 pl-6 last:pb-0"
                style={{ borderLeft: '1px solid var(--line)', marginLeft: 3 }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full"
                  style={{ background: index === profile.timeline.length - 1 ? 'var(--accent)' : 'var(--line-strong)' }}
                />
                <p className="font-serif text-[13px] italic" style={{ color: 'var(--accent)' }}>
                  {item.year}
                </p>
                <p className="mt-1.5 text-[14px] font-medium" style={{ color: 'var(--ink)' }}>
                  {item.title}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-7" style={{ color: 'var(--muted)' }}>
                  {item.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
