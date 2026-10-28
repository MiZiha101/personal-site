import { useState } from 'react';
import { useSiteData } from '../store/siteData';
import { SectionHeading } from './ui/SectionHeading';
import { Modal } from './Modal';
import { Markdown } from '../utils/markdown';
import type { Post } from '../types';

export function Notes() {
  const { data } = useSiteData();
  const [active, setActive] = useState<Post | null>(null);

  return (
    <section id="notes" className="section">
      <SectionHeading
        index="04"
        label="Notes"
        title="写下来，下次就不用重新踩一遍"
        desc="课程复盘、AI 编程实践和做项目时的一些取舍记录。"
      />

      <ul className="mt-10">
        {data.posts.map((post, index) => (
          <li key={post.id} className="reveal">
            <button
              type="button"
              onClick={() => setActive(post)}
              className="group grid w-full grid-cols-[auto_1fr] items-baseline gap-5 rounded-2xl px-3 py-5 text-left transition-colors duration-200 md:gap-8 md:px-5"
              style={{ borderTop: index === 0 ? '1px solid var(--line)' : 'none', borderBottom: '1px solid var(--line)' }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = 'transparent';
              }}
            >
              <span className="font-serif text-[13px] italic" style={{ color: 'var(--muted)' }}>
                {post.date}
              </span>

              <div className="min-w-0">
                <h3 className="display text-[17px] transition-colors group-hover:opacity-80 md:text-lg">{post.title}</h3>
                <p className="mt-1.5 max-w-prose text-[13px] leading-7" style={{ color: 'var(--muted)' }}>
                  {post.summary}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                  <span className="text-[11px] transition-colors group-hover:text-accent" style={{ color: 'var(--muted)' }}>
                    阅读全文 →
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={active !== null} onClose={() => setActive(null)} title={active?.title ?? ''}>
        {active ? (
          <>
            <div className="flex flex-wrap items-center gap-3 text-[11px]" style={{ color: 'var(--muted)' }}>
              <span className="font-serif italic">{active.date}</span>
              {active.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Markdown content={active.content} />
            </div>
          </>
        ) : null}
      </Modal>
    </section>
  );
}
