import { useState, type FormEvent } from 'react';
import { Check, Copy, Github, Mail, Send } from 'lucide-react';
import { useSiteData } from '../store/siteData';
import { SectionHeading } from './ui/SectionHeading';
import { useCopy } from '../hooks/useCopy';

type FormState = { name: string; email: string; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Contact() {
  const { data } = useSiteData();
  const { profile } = data;
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const { copied, copy } = useCopy(profile.email);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSent(false);
  };

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = '请至少写 2 个字符的称呼';
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = '邮箱格式看起来不对';
    if (form.message.trim().length < 10) next.message = '留言至少 10 个字，方便我知道你的诉求';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="section">
      <SectionHeading
        index="05"
        label="Contact"
        title="随时可以给我写信"
        desc="实习机会、项目合作、课程问题，或者只是想交流 AI 编程，都欢迎。我基本每天都会看邮箱。"
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="reveal space-y-4">
          <div className="card p-6">
            <p className="eyebrow">Email</p>
            <p className="mt-3 break-all text-[15px]" style={{ color: 'var(--ink)' }}>
              {profile.email}
            </p>
            <button type="button" onClick={copy} className="btn-ghost mt-4 w-full !py-2.5 text-[13px]" aria-live="polite">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? '已复制到剪贴板' : '复制邮箱地址'}
            </button>
            <p className="mt-3 text-[11.5px] leading-6" style={{ color: 'var(--muted)' }}>
              一般 24 小时内回复；实习相关请直接说明岗位方向和时间。
            </p>
          </div>

          <div className="card p-6">
            <p className="eyebrow">GitHub</p>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-2 text-[14px] hover:underline"
              style={{ color: 'var(--ink)' }}
            >
              <Github size={16} />
              {profile.githubLabel}
            </a>
            <p className="mt-3 text-[11.5px] leading-6" style={{ color: 'var(--muted)' }}>
              课程代码和练习记录都在这里，欢迎 star 或提 issue。
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="reveal card p-6 md:p-7" noValidate>
          <div className="flex items-center gap-2">
            <Mail size={15} style={{ color: 'var(--accent)' }} />
            <p className="text-[13px] font-medium">留言给我</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                你的称呼
              </span>
              <input
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="怎么称呼你"
                className="field-input mt-1.5"
                style={{ borderColor: errors.name ? '#c0523f' : 'var(--line)' }}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? <span className="mt-1 block text-[11px] text-[#c0523f]">{errors.name}</span> : null}
            </label>

            <label className="block">
              <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                你的邮箱
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                placeholder="you@example.com"
                className="field-input mt-1.5"
                style={{ borderColor: errors.email ? '#c0523f' : 'var(--line)' }}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? <span className="mt-1 block text-[11px] text-[#c0523f]">{errors.email}</span> : null}
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
              想说的话
            </span>
            <textarea
              rows={5}
              value={form.message}
              onChange={(event) => update('message', event.target.value)}
              placeholder="简单说明你的想法、需求或者想交流的问题"
              className="field-input mt-1.5 resize-y leading-7"
              style={{ borderColor: errors.message ? '#c0523f' : 'var(--line)' }}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message ? <span className="mt-1 block text-[11px] text-[#c0523f]">{errors.message}</span> : null}
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn-primary">
              <Send size={15} />
              发送留言
            </button>
            {sent ? (
              <p className="inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--accent)' }}>
                <Check size={15} />
                留言已记录，感谢反馈
              </p>
            ) : null}
          </div>

          <p className="mt-4 text-[11px] leading-6" style={{ color: 'var(--muted)' }}>
            这个表单只做前端校验与演示（没有接后端，内容不会上传）；需要我回复请直接用左边邮箱。
          </p>
        </form>
      </div>
    </section>
  );
}
