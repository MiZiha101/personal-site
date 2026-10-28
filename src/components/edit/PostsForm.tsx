import { Plus, Trash2 } from 'lucide-react';
import { useSiteData } from '../../store/siteData';
import { newId, type Post } from '../../types';
import { IconButton, TextArea, TextInput } from '../ui/Field';

export function PostsForm() {
  const { data, setPosts } = useSiteData();
  const list = data.posts;

  const update = (id: string, patch: Partial<Post>) => {
    setPosts(list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const add = () => {
    const now = new Date();
    setPosts([
      ...list,
      {
        id: newId('post'),
        title: '新笔记标题',
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
        tags: ['随笔'],
        summary: '一句话说明这篇写了什么。',
        content: '## 小标题\n\n正文从这里开始。支持 **加粗**、`行内代码`、列表和代码块。',
      },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">笔记（{list.length}）</p>
        <button type="button" className="inline-flex items-center gap-1 text-[12px]" style={{ color: 'var(--accent)' }} onClick={add}>
          <Plus size={13} />
          新增笔记
        </button>
      </div>

      {list.map((post) => (
        <div key={post.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface-soft)' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <TextInput label="标题" value={post.title} onChange={(event) => update(post.id, { title: event.target.value })} />
            </div>
            <div className="pt-6">
              <IconButton
                label="删除笔记"
                onClick={() => {
                  if (window.confirm(`确定删除「${post.title}」吗？`)) {
                    setPosts(list.filter((item) => item.id !== post.id));
                  }
                }}
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <TextInput label="日期" hint="如 2026-10" value={post.date} onChange={(event) => update(post.id, { date: event.target.value })} />
            <TextInput
              label="标签"
              hint="用逗号分隔"
              value={post.tags.join(', ')}
              onChange={(event) =>
                update(post.id, {
                  tags: event.target.value
                    .split(/[,，]/)
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>

          <div className="mt-3">
            <TextArea label="摘要" rows={2} value={post.summary} onChange={(event) => update(post.id, { summary: event.target.value })} />
          </div>

          <div className="mt-3">
            <TextArea
              label="正文（Markdown）"
              hint="支持 # 标题、- 列表、``` 代码块"
              rows={9}
              value={post.content}
              onChange={(event) => update(post.id, { content: event.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
