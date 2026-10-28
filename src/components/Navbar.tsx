import { useEffect, useState } from 'react';
import { Menu, Pencil, X } from 'lucide-react';
import { useSiteData } from '../store/siteData';

const links = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'notes', label: '笔记' },
  { id: 'contact', label: '联系' },
];

export function Navbar() {
  const { data, requestEdit: openEditor } = useSiteData();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      let current = 'home';
      links.forEach((link) => {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= 140) current = link.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(247, 245, 240, 0.86)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-content items-center justify-between px-6">
        <a href="#home" className="flex items-baseline gap-3">
          <span className="display text-lg">{data.profile.name}</span>
          <span className="hidden text-[11px] sm:inline" style={{ color: 'var(--muted)' }}>
            {data.profile.title}
          </span>
        </a>

        <nav className="hidden md:block" aria-label="主导航">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="relative px-3 py-2 text-[13px] transition-colors duration-200"
                  style={{ color: active === link.id ? 'var(--accent)' : 'var(--muted)' }}
                >
                  {link.label}
                  {active === link.id ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-0.5 h-px"
                      style={{ background: 'var(--accent)' }}
                    />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openEditor}
            className="hidden items-center gap-1.5 rounded-full border bg-surface px-4 py-2 text-[12px] transition-colors md:inline-flex"
            style={{ borderColor: 'var(--line-strong)', color: 'var(--ink-soft)' }}
          >
            <Pencil size={13} />
            编辑资料
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden" style={{ background: 'rgba(247,245,240,0.98)', borderBottom: '1px solid var(--line)' }}>
          <ul className="mx-auto max-w-content px-6 pb-4">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="block py-3 text-sm"
                  style={{ color: active === link.id ? 'var(--accent)' : 'var(--ink)' }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-[13px]"
                style={{ borderColor: 'var(--line-strong)' }}
                onClick={() => {
                  setOpen(false);
                  openEditor();
                }}
              >
                <Pencil size={13} />
                编辑资料
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
