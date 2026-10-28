import { Github, Mail } from 'lucide-react';
import { useSiteData } from '../store/siteData';

const links = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'notes', label: '笔记' },
  { id: 'contact', label: '联系' },
];

export function Footer() {
  const { data } = useSiteData();
  const { profile } = data;

  return (
    <footer className="mt-8">
      <div className="hairline mx-auto max-w-content" />
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="display text-lg">{profile.name}</p>
          <p className="mt-2 text-[12.5px] leading-7" style={{ color: 'var(--muted)' }}>
            {profile.title} · {profile.school}
          </p>
          <div className="mt-4 flex items-center gap-4" style={{ color: 'var(--muted)' }}>
            <a href={profile.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="hover:text-ink">
              <Github size={17} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="邮箱" className="hover:text-ink">
              <Mail size={17} />
            </a>
          </div>
        </div>

        <nav aria-label="页脚导航">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-2.5 text-[12.5px] md:grid-cols-1" style={{ color: 'var(--muted)' }}>
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="hairline">
        <div
          className="mx-auto flex max-w-content flex-col gap-2 px-6 py-5 text-[11.5px] md:flex-row md:items-center md:justify-between"
          style={{ color: 'var(--muted)' }}
        >
          <p>© {new Date().getFullYear()} {profile.name} · 内容与代码均为本人整理</p>
          <p>文章与项目均为个人学习记录，转载请注明出处</p>
        </div>
      </div>
    </footer>
  );
}
