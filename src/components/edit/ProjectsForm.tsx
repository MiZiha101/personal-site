import { Plus, Trash2 } from 'lucide-react';
import { useSiteData } from '../../store/siteData';
import { newId, type Project } from '../../types';
import { Field, IconButton, TextArea, TextInput } from '../ui/Field';

export function ProjectsForm() {
  const { data, setProjects } = useSiteData();
  const list = data.projects;

  const update = (id: string, patch: Partial<Project>) => {
    setProjects(list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const add = () => {
    setProjects([
      ...list,
      {
        id: newId('p'),
        title: '新项目',
        summary: '一句话说清这个项目做了什么。',
        desc: ['第一段：做了什么。', '第二段：难点和怎么解决的。'],
        tags: ['标签'],
        year: String(new Date().getFullYear()),
        status: '迭代中',
        kind: '自主项目',
      },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">项目（{list.length}）</p>
        <button type="button" className="inline-flex items-center gap-1 text-[12px]" style={{ color: 'var(--accent)' }} onClick={add}>
          <Plus size={13} />
          新增项目
        </button>
      </div>

      {list.map((project) => (
        <div key={project.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface-soft)' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <TextInput label="标题" value={project.title} onChange={(event) => update(project.id, { title: event.target.value })} />
            </div>
            <div className="pt-6">
              <IconButton
                label="删除项目"
                onClick={() => {
                  if (window.confirm(`确定删除「${project.title}」吗？`)) {
                    setProjects(list.filter((item) => item.id !== project.id));
                  }
                }}
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <TextInput label="类型" value={project.kind} onChange={(event) => update(project.id, { kind: event.target.value })} />
            <TextInput label="年份" value={project.year} onChange={(event) => update(project.id, { year: event.target.value })} />
            <Field label="状态">
              <select
                className="field-input"
                value={project.status}
                onChange={(event) => update(project.id, { status: event.target.value })}
              >
                <option value="已完成">已完成</option>
                <option value="迭代中">迭代中</option>
                <option value="进行中">进行中</option>
                <option value="已搁置">已搁置</option>
              </select>
            </Field>
          </div>

          <div className="mt-3">
            <TextArea label="一句话简介" rows={2} value={project.summary} onChange={(event) => update(project.id, { summary: event.target.value })} />
          </div>

          <div className="mt-3">
            <TextArea
              label="详细说明"
              hint="段落之间空一行"
              rows={4}
              value={project.desc.join('\n\n')}
              onChange={(event) => update(project.id, { desc: event.target.value.split(/\n{2,}/) })}
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <TextInput
              label="技术标签"
              hint="用逗号分隔"
              value={project.tags.join(', ')}
              onChange={(event) =>
                update(project.id, {
                  tags: event.target.value
                    .split(/[,，]/)
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />
            <TextInput label="演示地址（可选）" value={project.demo ?? ''} onChange={(event) => update(project.id, { demo: event.target.value })} />
          </div>

          <div className="mt-3">
            <TextInput label="源码地址（可选）" value={project.repo ?? ''} onChange={(event) => update(project.id, { repo: event.target.value })} />
          </div>
        </div>
      ))}

      <p className="text-[11px] leading-6" style={{ color: 'var(--muted)' }}>
        留空的演示 / 源码地址不会显示按钮。
      </p>
    </div>
  );
}
