import { Plus, Trash2 } from 'lucide-react';
import { useSiteData } from '../../store/siteData';
import { newId, type SkillGroup } from '../../types';
import { IconButton, TextInput } from '../ui/Field';

export function SkillsForm() {
  const { data, setSkillGroups } = useSiteData();
  const groups = data.skillGroups;

  const updateGroup = (groupId: string, patch: Partial<SkillGroup>) => {
    setSkillGroups(groups.map((group) => (group.id === groupId ? { ...group, ...patch } : group)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow">技能分组</p>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12px]"
          style={{ color: 'var(--accent)' }}
          onClick={() =>
            setSkillGroups([...groups, { id: newId('sg'), group: '新分组', items: [{ id: newId('s'), name: '新技能', level: 60 }] }])
          }
        >
          <Plus size={13} />
          新增分组
        </button>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface-soft)' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <TextInput
                label="分组名称"
                value={group.group}
                onChange={(event) => updateGroup(group.id, { group: event.target.value })}
              />
            </div>
            <div className="pt-6">
              <IconButton label="删除分组" onClick={() => setSkillGroups(groups.filter((item) => item.id !== group.id))}>
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {group.items.map((skill) => (
              <li key={skill.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <TextInput
                    label="技能"
                    value={skill.name}
                    onChange={(event) =>
                      updateGroup(group.id, {
                        items: group.items.map((item) => (item.id === skill.id ? { ...item, name: event.target.value } : item)),
                      })
                    }
                  />
                </div>
                <div className="w-20">
                  <TextInput
                    label="熟练度"
                    type="number"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(event) =>
                      updateGroup(group.id, {
                        items: group.items.map((item) =>
                          item.id === skill.id ? { ...item, level: Number(event.target.value) || 0 } : item,
                        ),
                      })
                    }
                  />
                </div>
                <IconButton
                  label="删除技能"
                  onClick={() => updateGroup(group.id, { items: group.items.filter((item) => item.id !== skill.id) })}
                >
                  <Trash2 size={14} />
                </IconButton>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-[12px]"
            style={{ color: 'var(--accent)' }}
            onClick={() => updateGroup(group.id, { items: [...group.items, { id: newId('s'), name: '新技能', level: 60 }] })}
          >
            <Plus size={13} />
            新增技能
          </button>
        </div>
      ))}

      <p className="text-[11px] leading-6" style={{ color: 'var(--muted)' }}>
        熟练度填 0–100，只影响进度条长短，不显示成分数以外的含义。
      </p>
    </div>
  );
}
