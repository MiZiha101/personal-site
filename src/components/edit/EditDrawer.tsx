import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, LogOut, X } from 'lucide-react';
import { useSiteData } from '../../store/siteData';
import { ProfileForm } from './ProfileForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { PostsForm } from './PostsForm';
import { DataPanel } from './DataPanel';

const tabs = [
  { id: 'profile', label: '基本信息' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'posts', label: '笔记' },
  { id: 'data', label: '数据' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function EditDrawer() {
  const { editing, setEditing, saveState, lock } = useSiteData();
  const [tab, setTab] = useState<TabId>('profile');

  useEffect(() => {
    if (!editing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEditing(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [editing, setEditing]);

  if (!editing) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="编辑内容">
      <button
        type="button"
        aria-label="关闭编辑面板"
        className="absolute inset-0"
        style={{ background: 'rgba(27, 26, 23, 0.28)', backdropFilter: 'blur(3px)' }}
        onClick={() => setEditing(false)}
      />

      <aside
        className="relative flex h-full w-full max-w-[640px] flex-col border-l bg-surface shadow-panel"
        style={{ borderColor: 'var(--line)' }}
      >
        <header className="border-b px-6 py-5" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="display text-xl">编辑内容</p>
              <p className="mt-1 text-[12px]" style={{ color: 'var(--muted)' }}>
                改动实时生效，自动保存在本机
                {saveState === 'saved' ? (
                  <span className="ml-2 inline-flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                    <Check size={12} />
                    已保存
                  </span>
                ) : null}
                {saveState === 'error' ? <span className="ml-2 text-[#c0523f]">保存失败（可能是隐私模式）</span> : null}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={lock}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px]"
                style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
              >
                <LogOut size={12} />
                退出编辑
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                aria-label="关闭"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] transition-colors"
                style={{
                  background: tab === item.id ? 'var(--accent-soft)' : 'transparent',
                  color: tab === item.id ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${tab === item.id ? 'var(--line-strong)' : 'transparent'}`,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {tab === 'profile' ? <ProfileForm /> : null}
          {tab === 'skills' ? <SkillsForm /> : null}
          {tab === 'projects' ? <ProjectsForm /> : null}
          {tab === 'posts' ? <PostsForm /> : null}
          {tab === 'data' ? <DataPanel /> : null}
        </div>

        <footer className="border-t px-6 py-4 text-[11px] leading-6" style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}>
          数据只存在这个浏览器里；游客看到的是代码里的默认内容。想让自己改的内容对所有人生效，去「数据」页导出后写进代码。
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
