import { ArrowUpRight, Check, Copy, Github, Mail, MapPin, Pencil } from 'lucide-react';
import { useSiteData } from '../store/siteData';
import { useCopy } from '../hooks/useCopy';

export function Hero() {
  const { data, setEditing, customized } = useSiteData();
  const { profile } = data;
  const { copied, copy } = useCopy(profile.email);

  const facts = [
    { label: '学校', value: profile.school },
    { label: '专业', value: profile.major },
    { label: '年级', value: profile.grade },
    { label: '所在地', value: profile.location },
  ];

  const stats = [
    { value: data.projects.length, label: '项目' },
    { value: data.skillGroups.reduce((sum, group) => sum + group.items.length, 0), label: '技能' },
    { value: data.posts.length, label: '笔记' },
  ];

  return (
    <section id="home" className="relative mx-auto max-w-content px-6 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="grid items-start gap-14 lg:grid-cols-[1.12fr_0.88fr]">
        <div>
          <p className="reveal eyebrow">{profile.title}</p>

          <h1 className="reveal display mt-6 text-[1.65rem] leading-[1.45] sm:text-[2.1rem] md:text-[2.6rem]">
            {profile.tagline.split('，').map((part, index, parts) => (
              <span key={`${part}-${index}`}>
                {part}
                {index < parts.length - 1 ? '，' : null}
                {index === 0 && parts.length > 1 ? <br className="sm:hidden" /> : null}
              </span>
            ))}
          </h1>

          <p className="reveal mt-6 max-w-prose text-[15px] leading-8" style={{ color: 'var(--muted)' }}>
            {profile.bio[0]}
          </p>

          <div
            className="reveal mt-7 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px]"
            style={{ borderColor: 'var(--line-strong)', background: 'var(--surface)', color: 'var(--ink-soft)' }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: '#5c8f7b' }} />
            </span>
            {profile.status}
          </div>

          <div className="reveal mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn-primary">
              看看我的项目
              <ArrowUpRight size={16} />
            </a>
            <a href={`mailto:${profile.email}`} className="btn-ghost">
              写封邮件
            </a>
            <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? '邮箱已复制' : '复制邮箱'}
            </button>
          </div>

          <div className="reveal mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]" style={{ color: 'var(--muted)' }}>
            <a href={profile.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-ink">
              <Github size={15} />
              {profile.githubLabel}
            </a>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-ink">
              <Mail size={15} />
              {profile.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} />
              {profile.location}
            </span>
          </div>
        </div>

        <aside className="reveal card overflow-hidden">
          <div className="flex items-center gap-4 border-b p-6" style={{ borderColor: 'var(--line)', background: 'var(--surface-soft)' }}>
            <div
              className="display flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--line-strong)' }}
            >
              {profile.avatarInitial}
            </div>
            <div className="min-w-0">
              <p className="display text-xl">{profile.name}</p>
              <p className="mt-1 truncate text-[12px]" style={{ color: 'var(--muted)' }}>
                {profile.major} · {profile.grade}
              </p>
            </div>
          </div>

          <dl className="divide-y" style={{ borderColor: 'var(--line)' }}>
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-6 px-6 py-3.5">
                <dt className="text-[12px]" style={{ color: 'var(--muted)' }}>
                  {fact.label}
                </dt>
                <dd className="text-right text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {fact.value || '—'}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-3 border-t" style={{ borderColor: 'var(--line)' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-4 text-center">
                <p className="display text-xl">{stat.value}</p>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex w-full items-center justify-center gap-2 border-t px-6 py-3 text-[12px] transition-colors"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)', background: 'var(--surface)' }}
          >
            <Pencil size={12} />
            {customized ? '内容已在本机修改过 · 点这里继续编辑' : '这些内容你都可以自己改（点这里）'}
          </button>
        </aside>
      </div>
    </section>
  );
}
