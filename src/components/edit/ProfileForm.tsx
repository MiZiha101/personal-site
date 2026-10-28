import { Plus, Trash2 } from 'lucide-react';
import { useSiteData } from '../../store/siteData';
import { newId, type CampusItem, type Profile, type TimelineItem } from '../../types';
import { Field, IconButton, TextArea, TextInput } from '../ui/Field';
import { ImageField } from '../ui/ImageField';

export function ProfileForm() {
  const { data, updateProfile } = useSiteData();
  const { profile } = data;

  const set = (key: keyof Profile, value: string) => {
    updateProfile({ [key]: value } as Partial<Profile>);
  };

  const updateCampus = (id: string, patch: Partial<CampusItem>) => {
    updateProfile({ campus: profile.campus.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };

  const updateTimeline = (id: string, patch: Partial<TimelineItem>) => {
    updateProfile({ timeline: profile.timeline.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <p className="eyebrow">基本信息</p>
        <ImageField
          label="个人照片"
          hint="圆形显示，会自动压缩到 512px 以内"
          value={profile.avatarImage}
          onChange={(value) => updateProfile({ avatarImage: value })}
          shape="circle"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="姓名" value={profile.name} onChange={(e) => set('name', e.target.value)} />
          <TextInput
            label="头像首字"
            hint="没有照片时显示的字"
            value={profile.avatarInitial}
            maxLength={2}
            onChange={(e) => set('avatarInitial', e.target.value)}
          />          <TextInput label="身份" hint="显示在导航旁" value={profile.title} onChange={(e) => set('title', e.target.value)} />
          <TextInput label="学校" value={profile.school} onChange={(e) => set('school', e.target.value)} />
          <TextInput label="专业" value={profile.major} onChange={(e) => set('major', e.target.value)} />
          <TextInput label="年级" value={profile.grade} onChange={(e) => set('grade', e.target.value)} />
          <TextInput label="所在地" value={profile.location} onChange={(e) => set('location', e.target.value)} />
          <TextInput label="当前状态" hint="首屏那条小字" value={profile.status} onChange={(e) => set('status', e.target.value)} />
        </div>
      </section>

      <section className="space-y-4">
        <p className="eyebrow">首屏文案</p>
        <TextArea label="一句话介绍（大标题）" rows={2} value={profile.tagline} onChange={(e) => set('tagline', e.target.value)} />
        <TextArea
          label="自我简介"
          hint="段落之间空一行"
          rows={7}
          value={profile.bio.join('\n\n')}
          onChange={(e) => updateProfile({ bio: e.target.value.split(/\n{2,}/) })}
        />
      </section>

      <section className="space-y-4">
        <p className="eyebrow">联系方式</p>
        <TextInput label="邮箱" value={profile.email} onChange={(e) => set('email', e.target.value)} />
        <TextInput label="GitHub 链接" value={profile.github} onChange={(e) => set('github', e.target.value)} />
        <TextInput label="GitHub 显示文字" value={profile.githubLabel} onChange={(e) => set('githubLabel', e.target.value)} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow">时间线</p>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[12px]"
            style={{ color: 'var(--accent)' }}
            onClick={() => updateProfile({ timeline: [...profile.timeline, { id: newId('tl'), year: '年份', title: '新节点', desc: '' }] })}
          >
            <Plus size={13} />
            新增
          </button>
        </div>
        {profile.timeline.map((item) => (
          <div key={item.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface-soft)' }}>
            <div className="flex items-start gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <TextInput label="时间" value={item.year} onChange={(e) => updateTimeline(item.id, { year: e.target.value })} />
                <TextInput label="标题" value={item.title} onChange={(e) => updateTimeline(item.id, { title: e.target.value })} />
              </div>
              <div className="pt-6">
                <IconButton label="删除这条时间线" onClick={() => updateProfile({ timeline: profile.timeline.filter((t) => t.id !== item.id) })}>
                  <Trash2 size={14} />
                </IconButton>
              </div>
            </div>
            <div className="mt-3">
              <TextArea label="描述" rows={2} value={item.desc} onChange={(e) => updateTimeline(item.id, { desc: e.target.value })} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow">校园经历</p>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[12px]"
            style={{ color: 'var(--accent)' }}
            onClick={() => updateProfile({ campus: [...profile.campus, { id: newId('cp'), title: '新的经历', desc: '' }] })}
          >
            <Plus size={13} />
            新增
          </button>
        </div>
        {profile.campus.map((item) => (
          <div key={item.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface-soft)' }}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <TextInput label="标题" value={item.title} onChange={(e) => updateCampus(item.id, { title: e.target.value })} />
              </div>
              <div className="pt-6">
                <IconButton label="删除这条经历" onClick={() => updateProfile({ campus: profile.campus.filter((c) => c.id !== item.id) })}>
                  <Trash2 size={14} />
                </IconButton>
              </div>
            </div>
            <div className="mt-3">
              <TextArea label="说明" rows={2} value={item.desc} onChange={(e) => updateCampus(item.id, { desc: e.target.value })} />
            </div>
          </div>
        ))}
      </section>

      <p className="text-[11px] leading-6" style={{ color: 'var(--muted)' }}>
        提示：带「示例」字样的内容记得换成你自己的真实经历，导出 JSON 后可以随时换回来。
      </p>

      <Field label="说明">
        <span className="text-[11.5px] leading-6" style={{ color: 'var(--muted)' }}>
          改动会立即生效，并自动保存在当前浏览器（localStorage）。换电脑或清理浏览器后会丢失，重要内容记得在「数据」页导出备份。
        </span>
      </Field>
    </div>
  );
}
