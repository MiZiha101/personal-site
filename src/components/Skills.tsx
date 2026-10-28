import { useSiteData } from '../store/siteData';
import { SectionHeading } from './ui/SectionHeading';

export function Skills() {
  const { data } = useSiteData();

  return (
    <section id="skills" className="section">
      <SectionHeading
        index="02"
        label="Skills"
        title="会一点，也还有很多在学"
        desc="进度条只是自评的投入程度，不代表水平。分数低的那几项，是我这学期正在补的。"
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {data.skillGroups.map((group) => (
          <div key={group.id} className="reveal card p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="display text-lg">{group.group}</h3>
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                {group.items.length} 项
              </span>
            </div>

            <ul className="mt-5 space-y-4">
              {group.items.map((skill) => (
                <li key={skill.id}>
                  <div className="flex items-baseline justify-between text-[13px]">
                    <span style={{ color: 'var(--ink-soft)' }}>{skill.name}</span>
                    <span className="font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full" style={{ background: 'var(--sand)' }}>
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, skill.level))}%`, background: 'var(--accent)' }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
