import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../store/siteData';
import { SectionHeading } from './ui/SectionHeading';
import { Modal } from './Modal';
import type { Project } from '../types';

export function Projects() {
  const { data } = useSiteData();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="section">
      <SectionHeading
        index="03"
        label="Selected Work"
        title="课设和实验室里做的东西"
        desc="都不算惊艳，但每一个是自己焊过、写过、调过的。点开能看到当时的取舍和踩到的坑。"
      />

      <ul className="mt-10">
        {data.projects.map((project, index) => (
          <li key={project.id} className="reveal">
            <button
              type="button"
              onClick={() => setActive(project)}
              className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-5 rounded-2xl px-3 py-6 text-left transition-colors duration-200 md:gap-8 md:px-5"
              style={{ borderTop: index === 0 ? '1px solid var(--line)' : 'none', borderBottom: '1px solid var(--line)' }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = 'transparent';
              }}
            >
              <span className="font-serif text-sm italic leading-7" style={{ color: 'var(--muted)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="flex min-w-0 items-start gap-4">
                {project.cover ? (
                  <img
                    src={project.cover}
                    alt={`${project.title} 的照片`}
                    className="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block"
                    style={{ border: '1px solid var(--line)' }}
                  />
                ) : null}

                <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="display text-lg transition-colors group-hover:opacity-80 md:text-xl">{project.title}</h3>
                  <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    {project.kind} · {project.year} · {project.status}
                  </span>
                </div>

                <p className="mt-2 max-w-prose text-[13.5px] leading-7" style={{ color: 'var(--muted)' }}>
                  {project.summary}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                </div>
              </div>

              <span
                className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:inline-flex"
                style={{ borderColor: 'var(--line-strong)', color: 'var(--accent)', background: 'var(--surface)' }}
                aria-hidden="true"
              >
                <ArrowUpRight size={15} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active?.title ?? ''}
        meta={
          active ? (
            <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--muted)' }}>
              <span>
                {active.kind} · {active.year} · {active.status}
              </span>
              {active.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null
        }
      >
        {active ? (
          <div className="space-y-4 text-[14.5px] leading-8" style={{ color: 'var(--ink-soft)' }}>
            {active.cover ? (
              <img
                src={active.cover}
                alt={`${active.title} 的照片`}
                className="max-h-72 w-full rounded-xl object-cover"
                style={{ border: '1px solid var(--line)' }}
              />
            ) : null}
            {active.desc.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
            ))}
            {active.demo || active.repo ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {active.demo ? (
                  <a href={active.demo} target="_blank" rel="noreferrer noopener" className="btn-primary !px-5 !py-2 text-[13px]">
                    在线体验
                  </a>
                ) : null}
                {active.repo ? (
                  <a href={active.repo} target="_blank" rel="noreferrer noopener" className="btn-ghost !px-5 !py-2 text-[13px]">
                    查看源码
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
